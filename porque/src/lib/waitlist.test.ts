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

describe('joinWaitlist with UTMs', () => {
  const env = { RESEND_API_KEY: 'k', RESEND_SEGMENT_ID: 'seg' };
  type Call = { url: string; body: Record<string, unknown> | null };
  function recorder(createStatuses: number[], calls: Call[]): typeof fetch {
    return (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const parsed: unknown = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
      const body =
        typeof parsed === 'object' && parsed !== null
          ? Object.fromEntries(Object.entries(parsed))
          : null;
      calls.push({ url, body });
      const status = url.includes('/contacts/') ? 404 : (createStatuses.shift() ?? 201);
      return Promise.resolve(new Response('{}', { status }));
    };
  }
  it('stores UTMs as contact properties', async () => {
    const calls: Call[] = [];
    const utm = { utm_source: 'instagram', utm_medium: 'bio' };
    assert.deepEqual(await joinWaitlist('a@b.co', env, recorder([], calls), utm), {
      status: 'subscribed',
    });
    assert.deepEqual(calls[1]?.body?.properties, utm);
  });
  it('omits properties without UTMs', async () => {
    const calls: Call[] = [];
    await joinWaitlist('a@b.co', env, recorder([], calls));
    assert.equal(calls[1]?.body?.properties, undefined);
  });
  it('retries without properties if Resend rejects them', async () => {
    const calls: Call[] = [];
    const res = await joinWaitlist('a@b.co', env, recorder([422], calls), { utm_source: 'x' });
    assert.deepEqual(res, { status: 'subscribed' });
    assert.equal(calls.length, 3);
    assert.equal(calls[2]?.body?.properties, undefined);
  });
  it('does not retry on 5xx', async () => {
    const calls: Call[] = [];
    const res = await joinWaitlist('a@b.co', env, recorder([500], calls), { utm_source: 'x' });
    assert.deepEqual(res, { status: 'error' });
    assert.equal(calls.length, 2);
  });
});
