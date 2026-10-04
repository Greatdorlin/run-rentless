/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node regression test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/components/webinar/confirmation-email-status.tsx', 'utf8');
const testModule = { exports: {} };
const jsx = (type, props) => ({ type, props });
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
assert.equal((compiled.diagnostics || []).length, 0);
vm.runInNewContext(compiled.outputText, { module: testModule, exports: testModule.exports, URLSearchParams, require: (name) => { assert.equal(name, 'react/jsx-runtime'); return { jsx, jsxs: jsx }; } });
const render = testModule.exports.ConfirmationEmailStatus;
const flatten = (node) => typeof node === 'string' ? node : Array.isArray(node) ? node.map(flatten).join(' ') : node?.props ? flatten(node.props.children) : '';
const links = (node) => Array.isArray(node) ? node.flatMap(links) : node?.props ? [...(node.type === 'a' ? [node.props.href] : []), ...links(node.props.children)] : [];
for (const [pending, duplicate, expected] of [[false, false, /submitted for delivery/], [true, false, /still pending/], [false, true, /No new confirmation email was sent/], [true, true, /No new confirmation email was sent/]]) {
  const tree = render({ email: 'test+webinar@example.com', pending, duplicate });
  const text = flatten(tree);
  assert.match(text, expected);
  assert.match(text, /do not need to register again/);
  assert.match(text, /test\+webinar@example.com/);
  const url = new URL(links(tree)[0]);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'info@runrentless.com');
  assert.equal(url.searchParams.get('subject'), 'Webinar confirmation not received');
  assert.match(url.searchParams.get('body'), /test\+webinar@example\.com/);
  console.log(`PASS email status pending=${pending} duplicate=${duplicate}`);
}
const malicious = 'x@example.com&bcc=someone@example.com\r\nX-Test: value';
const encoded = new URL(links(render({email: malicious, pending: true, duplicate: false}))[0]);
assert.equal(encoded.searchParams.has('bcc'), false);
assert.equal([...encoded.searchParams.keys()].length, 2);
assert.ok(encoded.searchParams.get('body').includes(malicious));
assert.ok(!source.includes('dangerouslySetInnerHTML'));
console.log('PASS support link encoding; no automatic resend or raw HTML');
