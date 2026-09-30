import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBusinessSector, businessSectors, positions } from '../src/lib/business-profile.ts';

test('common sector terms map to a clear Sender category', () => {
  assert.equal(normalizeBusinessSector('SaaS'), 'Software');
  assert.equal(normalizeBusinessSector(' healthtech '), 'Health');
  assert.equal(normalizeBusinessSector('Fintech'), 'Finance');
  assert.equal(normalizeBusinessSector('EDTECH'), 'Education');
});

test('other sectors can be entered without losing the answer', () => {
  assert.equal(normalizeBusinessSector('Waste management'), 'Waste management');
  assert.equal(normalizeBusinessSector(''), '');
  assert.ok(businessSectors.includes('Software'));
  assert.ok(positions.includes('Marketing Manager'));
});
