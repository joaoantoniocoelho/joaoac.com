import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { copy } from './copy.ts';

describe('landing copy', () => {
  it('keeps the two-part heading used by the landing layout in both languages', () => {
    for (const locale of ['en', 'pt-BR'] as const) {
      const parts = copy[locale].answerTitle.split(/(?<=\.)\s/);
      assert.equal(parts.length, 2);
      assert.ok(parts.every((part) => part.endsWith('.')));
    }
  });
});
