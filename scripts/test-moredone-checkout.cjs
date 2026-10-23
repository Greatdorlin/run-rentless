/* eslint-disable @typescript-eslint/no-require-imports -- Standalone route regression checks. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, dependencies = {}, globals = {}) {
  const mod = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  vm.runInNewContext(compiled.outputText, { module: mod, exports: mod.exports, URL, Request, Response, AbortSignal, crypto, console, process: { env: { NODE_ENV: 'production', SENDER_API: 'mock', PAYSTACK_SECRET_KEY: 'mock', CRON_SECRET: 'mock' } }, require: name => { assert.ok(name in dependencies, name); return dependencies[name]; }, ...globals });
  return mod.exports;
}

(async () => {
  const plans = load('src/lib/moredone.ts');
  const link = new URL(plans.moreDonePaymentRequest('A & B', 'Example', 2, 'other'));
  assert.equal(link.hostname, 'wa.me');
  assert.equal(link.pathname, '/250799904461');
  assert.match(link.searchParams.get('text'), /A & B Example/);
  assert.match(link.searchParams.get('text'), /\$180/);
  assert.equal([...link.searchParams.keys()].length, 1);

  let saves = 0, emails = 0;
  const followUps = [];
  const publicForm = load('src/lib/public-form-request.ts', {}, { TextDecoder });
  const initialize = load('src/app/api/moredone/initialize/route.ts', {
    'next/server': { after: callback => { followUps.push(callback); } },
    '@/lib/moredone': plans,
    '@/lib/moredone-sender': { saveMoreDoneLead: async () => { saves++; }, saveMoreDoneCheckoutUrl: async () => {} },
    '@/lib/moredone-email': { sendMoreDonePaymentRequest: async () => { emails++; } },
    '@/lib/public-form-request': publicForm,
  });
  const body = { firstName: 'Example', lastName: 'Buyer', email: 'buyer@example.com', company: 'Demo', project: 'Business website', consent: true, seats: 3, paymentCountry: 'rw' };
  for (const origin of ['https://www.runrentless.com', 'https://runrentless.com']) {
    const response = await initialize.POST(new Request(`${origin}/api/moredone/initialize`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(new URL(result.url).pathname, '/250799904461');
    assert.match(new URL(result.url).searchParams.get('text'), /330,000/);
  }
  assert.equal(saves, 2); assert.equal(emails, 0, 'Email must not hold up the payment response');
  await Promise.all(followUps.map(task => task()));
  assert.equal(emails, 2, 'Both payment emails still run after the response');
  const denied = await initialize.POST(new Request('https://www.runrentless.com/api/moredone/initialize', { method: 'POST', headers: { origin: 'https://example.com' }, body: '{}' }));
  assert.equal(denied.status, 403); assert.equal(saves, 2);
  const malformed = await initialize.POST(new Request('https://www.runrentless.com/api/moredone/initialize', { method: 'POST', headers: { origin: 'https://www.runrentless.com', 'Content-Type': 'application/json' }, body: '{' }));
  assert.equal(malformed.status, 400); assert.equal(saves, 2);

  let reminders = 0, confirmations = 0;
  const candidates = [
    { email: 'buyer@example.com', firstName: 'Example', seats: 3, reference: 'sample-paid', country: 'ng', url: 'https://checkout.paystack.com/sample' },
    { email: 'buyer@example.com', firstName: 'Example', seats: 1, reference: 'sample-unpaid', country: 'ng', url: 'https://checkout.paystack.com/sample' },
    { email: 'buyer@example.com', firstName: 'Example', seats: 2, reference: 'sample-global', country: 'other', url: link.toString() },
  ];
  const cron = load('src/app/api/moredone/reminders/route.ts', {
    '@/lib/moredone': plans,
    '@/lib/moredone-email': { sendMoreDoneCheckoutReminder: async () => { reminders++; return 'accepted'; }, sendMoreDonePaymentRequest: async () => { reminders++; return 'accepted'; } },
    '@/lib/moredone-sender': { listMoreDoneCheckoutCandidates: async () => candidates, markMoreDonePaid: async () => { confirmations++; }, markMoreDoneReminderAccepted: async () => {} },
  }, { fetch: async url => {
    const paid = String(url).endsWith('sample-paid');
    return Response.json({ status: true, data: { reference: paid ? 'sample-paid' : 'sample-unpaid', status: paid ? 'success' : 'abandoned', domain: 'live', currency: 'NGN', amount: plans.moreDonePlans[paid ? 3 : 1].amount, metadata: { product: 'more_done_challenge', seats: paid ? 3 : 1 } } });
  } });
  assert.equal((await cron.GET(new Request('https://www.runrentless.com/api/moredone/reminders'))).status, 401);
  const result = await cron.GET(new Request('https://www.runrentless.com/api/moredone/reminders', { headers: { authorization: 'Bearer mock' } }));
  assert.equal(result.status, 200);
  assert.equal(confirmations, 1); assert.equal(reminders, 2);
  assert.equal((await result.json()).failed, 0);
  const fieldList = [{ title: 'Existing answer', field_name: 'existing', id: 'existing' }];
  let profile = { firstname: 'Old', lastname: 'Name', columns: [{ title: 'Existing answer', value: 'Keep this' }], subscriber_tags: [] };
  let metadataCalls = 0;
  const actualSender = load('src/lib/moredone-sender.ts', {
    '@/lib/moredone': plans, '@/lib/moredone-email': {},
  }, { setTimeout, fetch: async (url, options = {}) => {
    const path = new URL(url).pathname;
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};
    if (path === '/v2/groups') { metadataCalls++; return Response.json({ data: [{ id: 'group', title: 'MoreDone Challenge' }] }); }
    if (path === '/v2/fields') {
      metadataCalls++;
      if (method === 'POST') fieldList.push({ title: body.title, field_name: `field${fieldList.length}`, id: `id${fieldList.length}` });
      return Response.json({ data: fieldList, meta: { last_page: 1 } });
    }
    assert.ok(path.startsWith('/v2/subscribers'));
    if (method === 'PATCH' || method === 'POST') {
      profile = { firstname: body.firstname || profile.firstname, lastname: body.lastname || profile.lastname, subscriber_tags: body.groups ? [{ id: 'group', title: 'MoreDone Challenge' }] : profile.subscriber_tags, columns: Object.entries(body.fields || {}).map(([name, value]) => ({ title: fieldList.find(field => field.field_name === name)?.title, value })) };
    }
    return Response.json({ data: profile });
  } });
  const lead = { firstName: 'Example', lastName: 'Buyer', email: 'buyer@example.com', company: 'Demo', teamSize: 'Just me', project: 'Business website', goal: 'An order page', seats: 3, reference: 'rrmd_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', paymentCountry: 'rw', checkoutUrl: plans.moreDonePaymentRequest('Example', 'Buyer', 3, 'rw') };
  await actualSender.saveMoreDoneLead(lead);
  const firstLookups = metadataCalls;
  await actualSender.saveMoreDoneLead(lead);
  assert.equal(metadataCalls, firstLookups, 'Warm requests reuse schema lookups');
  assert.equal(profile.firstname, 'Example');
  assert.equal(profile.columns.find(field => field.title === 'Existing answer').value, 'Keep this');
  assert.equal(profile.columns.find(field => field.title === 'MoreDone checkout URL').value, lead.checkoutUrl);
  fieldList.push({ title: 'New answer', field_name: 'new_answer', id: 'new' });
  profile.columns.push({ title: 'New answer', value: 'Also keep this' });
  await actualSender.saveMoreDoneLead(lead);
  assert.ok(metadataCalls > firstLookups, 'New fields refresh the cache');
  assert.equal(profile.columns.find(field => field.title === 'New answer').value, 'Also keep this');
  console.log('PASS schema cache saves lookups, stored names and answers verified, new fields retained, WhatsApp URL saved before handoff, email deferred until after response');
  console.log('PASS correct WhatsApp recipient, encoded names and totals, both production origins, registration sync and email, cron authorization, paid checkout suppression, international reminder');
})().catch(error => { console.error(error); process.exitCode = 1; });
