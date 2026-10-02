/* eslint-disable @typescript-eslint/no-require-imports -- This standalone Node test intentionally runs as CommonJS. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/app/api/webinar/route.ts', 'utf8');
const fieldNames = [...source.matchAll(/"(Webinar [^"]+)": "(\{\{[^}]+\}\})"/g)].map((m) => ({ title: m[1], field_name: m[2] }));
const fieldTitles = Object.fromEntries(fieldNames.map((f) => [f.field_name, f.title]));
const body = { firstName: 'Test', lastName: 'Only', email: 'test@example.invalid', attendingAs: 'individual', position: 'Founder / Owner', businessSector: 'Events', phoneNumber: '+2349033504689', eventConsent: true };

async function scenario(mode) {
  let record;
  let enrolled = false;
  let sends = 0;
  if (mode === 'duplicate') record = { firstname: 'Test', lastname: 'Only', phone: body.phoneNumber, subscriber_tags: [{ id: 'webinar', title: 'October 2026 Webinar' }], columns: fieldNames.map((f) => ({ title: f.title, value: f.title === 'Webinar confirmation accepted at' ? 'Already sent' : ({ 'Webinar attending as': 'Individual', 'Webinar company': 'Not applicable', 'Webinar phone': body.phoneNumber, 'Webinar position': body.position, 'Webinar business sector': body.businessSector, 'Webinar sector entered': body.businessSector })[f.title] || 'Registered' })) };
  const fetch = async (url, init = {}) => {
    const path = new URL(url).pathname;
    const json = (data, status = 200) => Response.json(data, { status });
    if (path.endsWith('/groups')) return json({ data: [{ id: 'webinar', title: 'October 2026 Webinar' }] });
    if (path.endsWith('/fields')) return json({ data: fieldNames });
    if (path.endsWith('/message/send')) { sends++; if (mode === 'timeout') throw new Error('simulated timeout'); return mode === 'accepted' ? json({ success: true, emailId: 'test-only' }) : json({}, 429); }
    if (path.endsWith('/events')) return json({});
    if (init.method === 'POST' || init.method === 'PATCH') {
      if (mode === 'save-failed') return json({}, 429);
      const value = JSON.parse(init.body);
      enrolled ||= value.trigger_automation === true;
      record = { firstname: value.firstname || record?.firstname, lastname: value.lastname || record?.lastname, phone: value.phone || record?.phone, subscriber_tags: (value.groups || ['webinar']).map((id) => ({ id })), columns: Object.entries(value.fields).map(([key, value]) => ({ title: fieldTitles[key] || key, value })) };
      return json({ data: record });
    }
    return record ? json({ data: mode === 'verification-failed' ? { ...record, phone: '' } : record }) : json({}, 404);
  };
  const testModule = { exports: {} };
  const requireStub = (name) => name === 'next/server' ? { NextResponse: { json: (data, init) => Response.json(data, init) } } : name.endsWith('/webinar') ? { WEBINAR_END: Date.now() + 86400000, WEBINAR_GROUP: 'October 2026 Webinar', WEBINAR_WHATSAPP_URL: 'https://example.invalid/test-only' } : name.endsWith('/business-profile') ? { positions: [body.position], businessSectors: [body.businessSector] } : name.endsWith('/submission-error') ? { submissionReference: () => 'TESTREF1', logSubmissionIssue: () => {}, submissionError: (message, status, reference) => Response.json({ ok: false, message, reference }, { status }) } : name.endsWith('/public-form-request') ? { readPublicForm: async (request) => { const value = await request.json(); return value && typeof value === 'object' && !Array.isArray(value) ? { body: value } : { status: 400, message: 'Invalid request' }; } } : { normalizeInternationalPhoneNumber: (value) => value };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: testModule, exports: testModule.exports, require: requireStub, process: { env: { SENDER_API: 'mock-only' } }, fetch, Response, URL, AbortSignal, console: { error() {}, info() {} }, setTimeout });
  const response = await testModule.exports.POST(new Request('https://example.invalid/api/webinar', { method: 'POST', body: JSON.stringify(body) }));
  const result = await response.json();
  if (mode === 'save-failed') { assert.equal(response.status, 502); assert.notEqual(result.ok, true); assert.equal(enrolled, false); }
  else if (mode === 'duplicate') { assert.equal(result.alreadyRegistered, true); assert.equal(sends, 0); assert.equal(enrolled, false); }
  else if (mode === 'accepted') { assert.equal(result.emailSent, true); assert.equal(record.columns.find((f) => f.title === 'Webinar confirmation accepted at')?.value.length > 0, true); }
  else { assert.equal(result.emailPending, true); assert.equal(result.ok, true); assert.equal(enrolled, true); assert.equal(result.emailSent, false); if (mode === 'verification-failed') { assert.equal(result.detailsUnverified, true); assert.equal(result.reference, 'TESTREF1'); } }
  const sendsBeforeInvalid = sends;
  for (const invalid of [null, [], "invalid"]) {
    const rejected = await testModule.exports.POST(new Request('https://example.invalid/api/webinar', { method: 'POST', body: JSON.stringify(invalid) }));
    assert.equal(rejected.status, 400);
  }
  assert.equal(sends, sendsBeforeInvalid);
  console.log(`PASS ${mode}`);
}
(async () => { for (const mode of ['rejected', 'timeout', 'accepted', 'duplicate', 'save-failed', 'verification-failed']) await scenario(mode); })().catch((error) => { console.error(error); process.exitCode = 1; });
