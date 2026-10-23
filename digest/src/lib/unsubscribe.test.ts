import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { VALID_TOKEN, preferredLocale, unsubscribeOutcome, unsubscribeUrl } from './unsubscribe.ts';

describe('unsubscribe', () => {
  it('accepts only tokens in the shape the API issues', () => {
    assert.equal(VALID_TOKEN.test('a'.repeat(32)), true);
    assert.equal(VALID_TOKEN.test('short'), false);
    assert.equal(VALID_TOKEN.test(`${'a'.repeat(30)}/../x`), false);
  });

  it('encodes the token into the API path', () => {
    assert.equal(
      unsubscribeUrl('https://api.example.com', 'abc_DEF-123'),
      'https://api.example.com/unsubscribe/abc_DEF-123',
    );
  });

  it('maps API answers to what the reader sees', () => {
    assert.equal(unsubscribeOutcome(200), 'success');
    assert.equal(unsubscribeOutcome(404), 'invalid');
    assert.equal(unsubscribeOutcome(500), 'unavailable');
  });

  it('prefers the saved language, then the browser language', () => {
    assert.equal(preferredLocale('en', 'pt-BR'), 'en');
    assert.equal(preferredLocale(null, 'pt-PT'), 'pt-BR');
    assert.equal(preferredLocale('fr', 'en-GB'), 'en');
  });
});
