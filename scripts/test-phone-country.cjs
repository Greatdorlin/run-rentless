/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS regression test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/app/api/phone-country/route.ts', 'utf8');
const testModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  module: testModule,
  exports: testModule.exports,
  require: (name) => require(name),
  Response,
});

(async () => {
  for (const [country, expected] of [['NG', '+234'], ['RW', '+250'], ['GB', '+44'], ['US', '+1'], ['XX', ''], ['', '']]) {
    const request = new Request('https://example.invalid/api/phone-country', { headers: country ? { 'x-vercel-ip-country': country } : {} });
    const response = testModule.exports.GET(request);
    assert.equal((await response.json()).dialCode, expected);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  }
  console.log('PASS visitor country prefixes and unknown-country fallback');
})().catch((error) => { console.error(error); process.exitCode = 1; });
