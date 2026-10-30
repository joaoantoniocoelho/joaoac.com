import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { joinWaitlist, normalizeEmail } from './waitlist.ts';

function fakeFetch(lookupStatus: number, calls: string[] = []): typeof fetch {
  return (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    calls.push(`${init?.method ?? 'GET'} ${url}`);
    const status = url.includes('/contacts/') ? lookupStatus : 201;
    return Promise.resolve(new Response('{}', { status }));
  };
}

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    assert.equal(normalizeEmail('  Ana@Exemplo.com '), 'ana@exemplo.com');
  });
  it('rejects junk', () => {
    assert.equal(normalizeEmail('ana@'), null);
    assert.equal(normalizeEmail(42), null);
  });
});

describe('joinWaitlist', () => {
  const env = { RESEND_API_KEY: 'k', RESEND_SEGMENT_ID: 'seg' };
  it('creates a new contact', async () => {
    const calls: string[] = [];
    assert.deepEqual(await joinWaitlist('a@b.co', env, fakeFetch(404, calls)), {
      status: 'subscribed',
    });
    assert.equal(calls.length, 2);
  });
  it('reports existing contacts', async () => {
    assert.deepEqual(await joinWaitlist('a@b.co', env, fakeFetch(200)), { status: 'already' });
  });
  it('sends confirmation only when a sender is set', async () => {
    const calls: string[] = [];
    await joinWaitlist(
      'a@b.co',
      { ...env, WAITLIST_FROM_EMAIL: 'x <x@y.co>' },
      fakeFetch(404, calls),
    );
    assert.ok(calls.some((c) => c.endsWith('/emails')));
  });
  it('fails closed without a key', async () => {
    assert.deepEqual(await joinWaitlist('a@b.co', {}, fakeFetch(404)), { status: 'error' });
  });
});
