/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node regression test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/webinar/event.ics/route.ts', 'utf8');
const testModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  module: testModule,
  exports: testModule.exports,
  require: () => ({ WEBINAR_LIVE_URL: 'https://youtube.com/live/jYBCMZPKW3I' }),
  Response,
});

(async () => {
  const response = testModule.exports.GET();
  const calendar = await response.text();
  assert.match(response.headers.get('content-type'), /^text\/calendar/);
  assert.match(calendar, /DTSTART:20261010T170000Z/);
  assert.match(calendar, /DTEND:20261010T190000Z/);
  assert.match(calendar, /URL:https:\/\/youtube\.com\/live\/jYBCMZPKW3I/);
  assert.equal((calendar.match(/BEGIN:VALARM/g) || []).length, 3);
  assert.match(calendar, /TRIGGER:-P1D/);
  assert.match(calendar, /TRIGGER:-PT1H/);
  assert.match(calendar, /TRIGGER:-PT10M/);
  assert.ok(calendar.endsWith('\r\n'));
  console.log('PASS webinar calendar');
})().catch((error) => { console.error(error); process.exitCode = 1; });
