import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Compile the email module in memory so its framework-style import resolves in Node.
const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/lib/audit-report.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
new Function('require', 'exports', compiled)((path) => path === './audit' ? require('../src/lib/audit.ts') : require(path), exports);
const { parseAudit, reportEmail } = exports;
const tool = (patch = {}) => ({ name: 'Booking tool', category: 'Scheduling', currency: 'USD', costMode: 'actual', amount: '20', billing: 'Monthly', billBasis: 'Flat fee', features: [], workaround: 'Rarely', wish: '', ...patch });

test('a complete simple report contains useful advice without empty or irrelevant notes', () => {
  const report = reportEmail('Greatdorlin', parseAudit({ tools: [tool()] }));
  for (const content of [report.text, report.html]) {
    assert.match(content, /Keep it for now/);
    assert.match(content, /bill stays the same/);
    assert.doesNotMatch(content, /Not supplied|Not answered|0 missing|incomplete costs|different currencies|Before adding more people|Are you paying twice|GROWTH PROFILE|infrastructure|migration/);
  }
});

test('missing bills and different currencies are explained only when relevant', () => {
  const report = reportEmail('Reader', parseAudit({ tools: [tool(), tool({ name: 'CRM', amount: '' }), tool({ name: 'Forms', currency: 'GBP' })] }));
  assert.match(report.text, /not included CRM/);
  assert.match(report.text, /Each currency has its own total/);
});

test('user text remains escaped in the HTML email', () => {
  const report = reportEmail('<script>', parseAudit({ tools: [tool({ wish: '<img src=x onerror=alert(1)>' })] }));
  assert.doesNotMatch(report.html, /<script>|<img src=x/);
  assert.match(report.html, /&lt;img/);
});
