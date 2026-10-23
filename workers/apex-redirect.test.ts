import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canonicalUrl } from './apex-redirect.ts';

describe('canonicalUrl', () => {
  it('sends the bare domain to www, keeping the path and query', () => {
    assert.equal(
      canonicalUrl('https://joaoac.com/blog/this-breach-was-preventable?ref=x'),
      'https://www.joaoac.com/blog/this-breach-was-preventable?ref=x',
    );
  });

  it('sends www.digest to the digest host', () => {
    assert.equal(
      canonicalUrl('https://www.digest.joaoac.com/digest/2026-10-21'),
      'https://digest.joaoac.com/digest/2026-10-21',
    );
  });

  it('always lands on https', () => {
    assert.equal(canonicalUrl('http://joaoac.com/'), 'https://www.joaoac.com/');
  });
});
