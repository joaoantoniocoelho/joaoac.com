import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mergeFirstTouch, sanitizeUtm, sanitizeUtmValue, utmFromSearch } from './utm.ts';

describe('sanitizeUtmValue', () => {
  it('lowercases and strips junk', () => {
    assert.equal(sanitizeUtmValue('  Instagram '), 'instagram');
    assert.equal(sanitizeUtmValue('<script>x</script>'), 'script-x-script');
    assert.equal(sanitizeUtmValue('---'), null);
    assert.equal(sanitizeUtmValue(3), null);
  });
  it('caps length at 64', () => {
    assert.equal(sanitizeUtmValue('a'.repeat(200))?.length, 64);
  });
});

describe('sanitizeUtm', () => {
  it('keeps only known keys', () => {
    assert.deepEqual(sanitizeUtm({ utm_source: 'TikTok', foo: 'x', utm_medium: '' }), {
      utm_source: 'tiktok',
    });
    assert.deepEqual(sanitizeUtm(null), {});
  });
});

describe('utmFromSearch / mergeFirstTouch', () => {
  it('reads the query string', () => {
    assert.deepEqual(utmFromSearch('?utm_source=instagram&utm_medium=bio&x=1'), {
      utm_source: 'instagram',
      utm_medium: 'bio',
    });
  });
  it('first touch wins, gaps get filled', () => {
    assert.deepEqual(
      mergeFirstTouch({ utm_source: 'instagram' }, { utm_source: 'tiktok', utm_medium: 'bio' }),
      { utm_source: 'instagram', utm_medium: 'bio' },
    );
  });
});
