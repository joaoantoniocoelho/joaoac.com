import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  loadEdition,
  loadEditionPage,
  loadLatestEdition,
  parseEdition,
  safeArticleUrl,
  type Fetcher,
} from './editions.ts';

const api = 'https://api.example.com';

const edition = {
  date: '2026-09-23',
  articles: [
    {
      title: 'Formal methods',
      url: 'https://example.com/a',
      source: 'Pragmatic',
      topics: ['engineering', 3],
      why_interesting: null,
    },
    { title: 42, url: 'https://example.com/b', source: 'Broken' },
  ],
  older_date: '2026-09-22',
  newer_date: null,
};

function fakeApi(routes: Record<string, { status: number; body?: unknown }>): {
  fetcher: Fetcher;
  calls: string[];
} {
  const calls: string[] = [];
  const fetcher: Fetcher = (url) => {
    calls.push(url);
    const route = routes[url];
    if (!route) return Promise.reject(new Error('network down'));
    return Promise.resolve(
      new Response(JSON.stringify(route.body ?? {}), { status: route.status }),
    );
  };
  return { fetcher, calls };
}

describe('parseEdition', () => {
  it('keeps valid articles and drops malformed ones', () => {
    const parsed = parseEdition(edition);
    assert.ok(parsed);
    assert.equal(parsed.articles.length, 1);
    assert.deepEqual(parsed.articles[0]?.topics, ['engineering']);
    assert.equal(parsed.older_date, '2026-09-22');
  });

  it('rejects a payload without a date', () => {
    assert.equal(parseEdition({ articles: [] }), null);
  });

  it('has no note when the api sends none', () => {
    assert.equal(parseEdition(edition)?.note, null);
    assert.equal(parseEdition({ ...edition, note: null })?.note, null);
  });

  it('splits the note intro into paragraphs', () => {
    const parsed = parseEdition({
      ...edition,
      note: {
        title: 'My post',
        url: 'https://www.joaoac.com/blog/my-post',
        intro: 'First paragraph.\n\nSecond paragraph.\n',
      },
    });
    assert.deepEqual(parsed?.note, {
      title: 'My post',
      url: 'https://www.joaoac.com/blog/my-post',
      paragraphs: ['First paragraph.', 'Second paragraph.'],
    });
  });

  it('keeps a note without a link as a standalone comment', () => {
    for (const url of [null, '', undefined]) {
      const parsed = parseEdition({
        ...edition,
        note: { title: 'This week', url, intro: 'Two short sentences.' },
      });
      assert.deepEqual(parsed?.note, {
        title: 'This week',
        url: null,
        paragraphs: ['Two short sentences.'],
      });
    }
  });

  it('drops a malformed note and keeps the edition', () => {
    const notes = [
      { title: 'My post', url: 'javascript:alert(1)', intro: 'Text.' },
      { title: 'My post', url: 'https://www.joaoac.com/blog/my-post', intro: ' \n ' },
      { title: 42, url: 'https://www.joaoac.com/blog/my-post', intro: 'Text.' },
      { title: 'My post', url: 42, intro: 'Text.' },
      'a note',
    ];
    for (const note of notes) {
      const parsed = parseEdition({ ...edition, note });
      assert.ok(parsed);
      assert.equal(parsed.note, null);
      assert.equal(parsed.articles.length, 1);
    }
  });
});

describe('loadEdition', () => {
  it('reports a missing edition separately from an outage', async () => {
    const { fetcher } = fakeApi({ [`${api}/digests/2026-01-01`]: { status: 404 } });
    assert.deepEqual(await loadEdition(api, '2026-01-01', fetcher), {
      ok: false,
      error: 'missing',
    });
    assert.deepEqual(await loadEdition(api, '2026-01-02', fetcher), {
      ok: false,
      error: 'unavailable',
    });
  });
});

describe('loadEditionPage', () => {
  it('treats a response without pagination as unavailable', async () => {
    const { fetcher } = fakeApi({
      [`${api}/digests?page=1`]: { status: 200, body: { editions: [] } },
    });
    assert.deepEqual(await loadEditionPage(api, 1, fetcher), { ok: false, error: 'unavailable' });
  });
});

describe('loadLatestEdition', () => {
  it('loads the newest edition from the first archive page', async () => {
    const { fetcher, calls } = fakeApi({
      [`${api}/digests?page=1`]: {
        status: 200,
        body: { editions: [{ date: '2026-09-23', article_count: 1 }], page: 1, has_more: false },
      },
      [`${api}/digests/2026-09-23`]: { status: 200, body: edition },
    });
    const latest = await loadLatestEdition(api, fetcher);
    assert.equal(latest?.date, '2026-09-23');
    assert.deepEqual(calls, [`${api}/digests?page=1`, `${api}/digests/2026-09-23`]);
  });

  it('returns null when the API is down, so the landing can show its sample', async () => {
    const { fetcher } = fakeApi({});
    assert.equal(await loadLatestEdition(api, fetcher), null);
  });
});

describe('safeArticleUrl', () => {
  it('only allows http and https links', () => {
    assert.equal(safeArticleUrl('javascript:alert(1)'), null);
    assert.equal(safeArticleUrl('https://example.com'), 'https://example.com');
  });
});
