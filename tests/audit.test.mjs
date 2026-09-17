import test from 'node:test';
import assert from 'node:assert/strict';
import { verdict, explanation, summarizeAudit } from '../src/lib/audit.ts';

const tool = (patch = {}) => ({ id: 1, name: 'Calendly', category: 'Scheduling', currency: 'USD', costMode: 'actual', amount: '20', billing: 'Monthly', billBasis: 'Flat fee', charges: [], features: [], workaround: 'Not answered', users: 'Not answered', data: 'Not answered', criticality: 'Not answered', wish: '', ...patch });

test('unanswered tools explicitly lack enough evidence, not a confident keep recommendation', () => {
  assert.match(explanation(tool()), /Not enough detail/);
});
test('Calendly recommendations change with workflow evidence', () => {
  assert.equal(verdict(tool({ workaround: 'Rarely' })), 'KEEP');
  assert.equal(verdict(tool({ workaround: 'Sometimes', wish: 'Route bookings by location' })), 'BUILD AROUND');
  assert.equal(verdict(tool({ workaround: 'Constantly' })), 'LOOK CLOSER');
  assert.match(explanation(tool({ workaround: 'Constantly' })), /custom booking workflow/);
});
test('negative free text does not invent a missing requirement', () => {
  for (const wish of ['none', 'Nothing.', 'N/A', 'no', 'all good']) assert.equal(verdict(tool({ workaround: 'Rarely', wish })), 'KEEP');
});
test('a request alone is a reason to investigate an extension, not replacement', () => {
  assert.equal(verdict(tool({ category: 'CRM & Sales', wish: 'Reassign leads after 48 hours' })), 'BUILD AROUND');
  assert.equal(verdict(tool({ category: 'CRM & Sales', workaround: 'Constantly' })), 'LOOK CLOSER');
});
test('infrastructure categories retain a cautious build-around path', () => {
  for (const category of ['Automation', 'Finance', 'Documents', 'Marketing & Email']) assert.equal(verdict(tool({ category, workaround: 'Constantly' })), 'BUILD AROUND');
});
test('missing costs stay unknown; currencies are not combined', () => {
  const result = summarizeAudit([tool(), tool({ id: 2, currency: 'GBP', amount: '120', billing: 'Yearly' }), tool({ id: 3, amount: '' })]);
  assert.deepEqual(result.totals, { USD: 20, GBP: 10 });
  assert.equal(result.unknownCosts, 1);
});
test('headcount growth leaves fixed charges unchanged', () => {
  const result = summarizeAudit([tool({ costMode: 'calculate', charges: [{ id: 1, label: 'Base', type: 'Flat fee', rate: '500', quantity: '1', billing: 'Monthly' }, { id: 2, label: 'Seats', type: 'Per user / seat', rate: '50', quantity: '20', billing: 'Monthly' }] })], '20', '30');
  assert.equal(result.totals.USD, 1500);
  assert.equal(result.futureTotals.USD, 2000);
});
