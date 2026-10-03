/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS regression test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/api/waitlist/route.ts', 'utf8');
const definitions = [...source.matchAll(/(\w+): \{ title: "([^"]+)", type: "[^"]+", fieldName: "([^"]+)" \}/g)];
const fields = definitions.map((match) => ({ title: match[2], field_name: match[3] }));
const titles = Object.fromEntries(fields.map((field) => [field.field_name, field.title]));
const body = { firstName: 'Test', lastName: 'Only', email: 'test@example.invalid', company: 'Example', position: 'Founder / Owner', businessSector: 'Events', followupConsent: true, interest: 'Software Rent Audit', teamSize: '1 to 10', reportConsent: true, audit: { tools: [] } };

async function scenario(mode) {
  let subscriber;
  let emails = 0;
  const json = (value, status = 200) => Response.json(value, { status });
  const fetch = async (url, init = {}) => {
    const path = new URL(url).pathname;
    if (path.endsWith('/groups')) return json({ data: [{ id: 'audit', title: 'Run Rentless Software Audits' }] });
    if (path.endsWith('/fields')) return json({ data: fields, meta: { last_page: 1 } });
    if (path.endsWith('/events')) { if (mode === 'event-failed') throw new Error('simulated event timeout'); return json({}); }
    if (path.endsWith('/message/send')) { emails++; if (mode === 'email-timeout') throw new Error('simulated message timeout'); return mode === 'email-invalid-response' ? new Response('not json') : json({ success: true, emailId: 'accepted-test' }); }
    if (init.method === 'POST' || init.method === 'PATCH') {
      if (mode === 'save-failed') return json({}, 429);
      const saved = JSON.parse(init.body);
      subscriber = { columns: Object.entries(saved.fields).map(([name, value]) => ({ title: titles[name], value })) };
      return json({ data: subscriber });
    }
    return subscriber ? json({ data: mode === 'verify-failed' ? { columns: [] } : subscriber }) : json({}, 404);
  };
  const testModule = { exports: {} };
  const requireStub = (name) => name === 'next/server' ? { NextResponse: { json: (value, init) => Response.json(value, init) } } : name.endsWith('/audit-report') ? { parseAudit: () => ({ tools: [], priority: null }), reportEmail: () => ({ text: 'test', html: '<p>test</p>' }), auditSummary: () => 'Test audit.' } : name.endsWith('/submission-error') ? { submissionReference: () => 'TESTREF1', logSubmissionIssue: () => {}, submissionError: (message, status, reference) => json({ ok: false, message, reference }, status) } : name.endsWith('/public-form-request') ? { readPublicForm: async (request) => ({ body: await request.json() }) } : name.endsWith('/business-profile') ? { positions: [body.position], businessSectors: [body.businessSector] } : { budgetRanges: [], deliveryPreferences: [], savingsChoices: [], verdict: () => 'KEEP' };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: testModule, exports: testModule.exports, require: requireStub, process: { env: { SENDER_API: 'mock-only' } }, fetch, Response, URL, AbortSignal, console: { error() {}, info() {} } });
  const response = await testModule.exports.POST(new Request('https://example.invalid/api/waitlist', { method: 'POST', body: JSON.stringify(body) }));
  const result = await response.json();
  if (mode === 'save-failed' || mode === 'verify-failed') { assert.equal(response.status, 502); assert.equal(result.reference, 'TESTREF1'); assert.equal(emails, 0); }
  else if (mode === 'email-timeout' || mode === 'email-invalid-response') { assert.equal(response.status, 202, JSON.stringify(result)); assert.equal(result.ok, true); assert.equal(result.reportSent, false); assert.equal(result.reference, 'TESTREF1'); }
  else { assert.equal(response.status, 200); assert.equal(result.reportSent, true); assert.equal(emails, 1); assert.equal(subscriber.columns.find((field) => field.title === 'Audit contact role')?.value, body.position); assert.equal(subscriber.columns.find((field) => field.title === 'Audit business sector')?.value, body.businessSector); assert.equal(subscriber.columns.find((field) => field.title === 'Audit follow-up permission')?.value, 'Yes'); }
  console.log(`PASS ${mode}`);
}

(async () => { for (const mode of ['accepted', 'event-failed', 'email-timeout', 'email-invalid-response', 'save-failed', 'verify-failed']) await scenario(mode); })().catch((error) => { console.error(error); process.exitCode = 1; });
