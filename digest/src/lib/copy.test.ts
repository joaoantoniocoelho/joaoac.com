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

  it('keeps the home title and description within what search results show', () => {
    for (const locale of ['en', 'pt-BR'] as const) {
      assert.ok(copy[locale].homeTitle.length <= 60, `${locale} homeTitle is too long`);
      assert.ok(
        copy[locale].homeDescription.length <= 160,
        `${locale} homeDescription is too long`,
      );
    }
  });
});
