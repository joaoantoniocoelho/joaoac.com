import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PLANS, formatBRL, perMonthCents, yearlyDiscountPercent } from './pricing.ts';

describe('pricing', () => {
  it('formats cents as BRL with a plain space', () => {
    assert.equal(formatBRL(6990), 'R$ 69,90');
    assert.equal(formatBRL(990), 'R$ 9,90');
  });

  it('splits the yearly price per month', () => {
    assert.equal(formatBRL(perMonthCents(PLANS.anual.cents)), 'R$ 5,83');
  });

  it('computes the yearly discount against twelve monthly payments', () => {
    assert.equal(yearlyDiscountPercent(PLANS.anual.cents, PLANS.mensal.cents), 41);
  });
});
