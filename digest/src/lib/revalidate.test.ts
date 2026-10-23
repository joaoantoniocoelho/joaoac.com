import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bearerToken, parseRevalidatePayload, tagsToPurge, tokenMatches } from './revalidate.ts';

describe('parseRevalidatePayload', () => {
  it('accepts a date and an optional previous date', () => {
    assert.deepEqual(parseRevalidatePayload({ date: '2026-10-22' }), {
      date: '2026-10-22',
      previousDate: null,
    });
    assert.deepEqual(parseRevalidatePayload({ date: '2026-10-22', previousDate: '2026-10-21' }), {
      date: '2026-10-22',
      previousDate: '2026-10-21',
    });
  });

  it('rejects impossible or malformed dates', () => {
    assert.equal(parseRevalidatePayload({ date: '2026-02-30' }), null);
    assert.equal(parseRevalidatePayload({ date: '22/10/2026' }), null);
    assert.equal(parseRevalidatePayload({ date: '2026-10-22', previousDate: 'yesterday' }), null);
    assert.equal(parseRevalidatePayload(null), null);
  });
});

describe('tagsToPurge', () => {
  it('purges the archive, the new edition and the one before it', () => {
    assert.deepEqual(tagsToPurge({ date: '2026-10-22', previousDate: '2026-10-21' }), [
      'digest-editions',
      'digest-edition-2026-10-22',
      'digest-edition-2026-10-21',
    ]);
  });
});

describe('tokenMatches', () => {
  it('accepts only the exact token', async () => {
    assert.equal(await tokenMatches('s3cret', 's3cret'), true);
    assert.equal(await tokenMatches('s3cre', 's3cret'), false);
    assert.equal(await tokenMatches('', 's3cret'), false);
    assert.equal(await tokenMatches('s3cret', ''), false);
  });
});

describe('bearerToken', () => {
  it('reads the token from a Bearer header only', () => {
    assert.equal(bearerToken('Bearer abc'), 'abc');
    assert.equal(bearerToken('Basic abc'), '');
    assert.equal(bearerToken(null), '');
  });
});
