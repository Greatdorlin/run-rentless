/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS regression test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/lib/public-form-request.ts', 'utf8');
const moduleRef = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: moduleRef, exports: moduleRef.exports, TextDecoder, Uint8Array, Number, URL });
const { readPublicForm } = moduleRef.exports;
const request = (body, headers = {}) => new Request('https://www.runrentless.com/api/webinar', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body });

(async () => {
  assert.equal((await readPublicForm(request('{"firstName":"Ada"}'), 100)).body.firstName, 'Ada');
  assert.equal((await readPublicForm(request('{"x":1}', { origin: 'https://evil.example' }), 100)).status, 403);
  assert.equal((await readPublicForm(request('{"x":1}', { 'sec-fetch-site': 'cross-site' }), 100)).status, 403);
  assert.equal((await readPublicForm(request('{"x":1}', { 'content-type': 'text/plain' }), 100)).status, 400);
  assert.equal((await readPublicForm(request('{"x":1}', { 'content-length': '999' }), 100)).status, 413);
  assert.equal((await readPublicForm(request(JSON.stringify({ x: 'a'.repeat(200) })), 100)).status, 413);
  assert.equal((await readPublicForm(request('{bad'), 100)).status, 400);
  assert.equal((await readPublicForm(request('[]'), 100)).status, 400);
  console.log('PASS bounded public form parsing and cross-site checks');
})().catch((error) => { console.error(error); process.exitCode = 1; });
