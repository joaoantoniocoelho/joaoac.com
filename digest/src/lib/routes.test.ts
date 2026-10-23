import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Fetcher } from './editions.ts';
import { archiveRoute, editionRoute } from './routes.ts';

const api = 'https://api.example.com';

const respond =
  (routes: Record<string, { status: number; body?: unknown }>): Fetcher =>
  (url) => {
    const route = routes[url];
    if (!route) return Promise.reject(new Error('network down'));
    return Promise.resolve(
      new Response(JSON.stringify(route.body ?? {}), { status: route.status }),
    );
  };

const archivePage = (page: number, editions: unknown[], hasMore = false) => ({
  status: 200,
  body: { editions, page, has_more: hasMore },
});

describe('archiveRoute', () => {
  it('redirects pages the API would reject', async () => {
    assert.deepEqual(await archiveRoute(api, '0', respond({})), { kind: 'redirect' });
    assert.deepEqual(await archiveRoute(api, 'abc', respond({})), { kind: 'redirect' });
  });

  it('treats a page past the end as missing, but an empty first page as an empty archive', async () => {
    const fetcher = respond({
      [`${api}/digests?page=1`]: archivePage(1, []),
      [`${api}/digests?page=9`]: archivePage(9, []),
    });
    assert.deepEqual(await archiveRoute(api, '9', fetcher), { kind: 'missing' });
    const first = await archiveRoute(api, null, fetcher);
    assert.equal(first.kind, 'ok');
  });

  it('reports an outage instead of an empty archive', async () => {
    assert.deepEqual(await archiveRoute(api, null, respond({})), { kind: 'unavailable' });
  });
});

describe('editionRoute', () => {
  it('rejects anything that is not a calendar date before calling the API', async () => {
    assert.deepEqual(await editionRoute(api, '../secrets', respond({})), { kind: 'missing' });
    assert.deepEqual(await editionRoute(api, undefined, respond({})), { kind: 'missing' });
  });

  it('loads an existing edition', async () => {
    const fetcher = respond({
      [`${api}/digests/2026-10-22`]: {
        status: 200,
        body: { date: '2026-10-22', articles: [], older_date: null, newer_date: null },
      },
    });
    const result = await editionRoute(api, '2026-10-22', fetcher);
    assert.equal(result.kind, 'ok');
  });
});
