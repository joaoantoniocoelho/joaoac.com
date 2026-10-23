import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { moonDots } from './dots.ts';

describe('moonDots', () => {
  it('fills the whole grid', () => {
    assert.equal(moonDots(12, 12).length, 144);
  });

  it('has exactly one accent dot, inside the disc', () => {
    const dots = moonDots(30, 14);
    assert.equal(dots.filter((d) => d.tone === 2).length, 1);
    assert.ok(dots.some((d) => d.tone === 1));
  });
});
