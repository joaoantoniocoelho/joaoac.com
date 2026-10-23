import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatPostDate, localizedPosts, topicsOf, type PostEntry } from './posts.ts';

const entry = (id: string, data: Partial<PostEntry['data']> = {}): PostEntry => ({
  id,
  data: {
    title: `title ${id}`,
    description: `description ${id}`,
    date: '2025-01-01',
    tags: ['engineering'],
    draft: false,
    ...data,
  },
});

describe('localizedPosts', () => {
  const entries = [
    entry('old', { date: '2024-01-24' }),
    entry('new', { date: '2025-09-09', tags: ['security', 'apis'] }),
    entry('new.pt-BR', { date: '1999-01-01', tags: ['seguranca'], draft: true }),
    entry('draft', { date: '2025-10-01', draft: true }),
  ];

  it('lists English posts newest first and hides drafts', () => {
    const posts = localizedPosts(entries, 'en', false);
    assert.deepEqual(
      posts.map((post) => post.slug),
      ['new', 'old'],
    );
    assert.equal(posts[0]?.title, 'title new');
  });

  it('uses the translation text but keeps the English slug, date and draft flag', () => {
    const [post] = localizedPosts(entries, 'pt-BR', false);
    assert.ok(post);
    assert.equal(post.slug, 'new');
    assert.equal(post.title, 'title new.pt-BR');
    assert.equal(post.date, '2025-09-09');
    assert.equal(post.draft, false);
    assert.equal(post.entry.id, 'new.pt-BR');
    assert.equal(post.topic, 'seguranca');
  });

  it('falls back to English when a post has no translation', () => {
    const posts = localizedPosts(entries, 'pt-BR', false);
    assert.equal(posts[1]?.title, 'title old');
  });

  it('includes drafts when asked to', () => {
    const posts = localizedPosts(entries, 'en', true);
    assert.equal(posts[0]?.slug, 'draft');
  });
});

describe('formatPostDate', () => {
  it('formats the calendar date regardless of the machine time zone', () => {
    assert.equal(formatPostDate('2025-09-09', 'en'), 'september 9, 2025');
    assert.equal(formatPostDate('2025-09-09', 'pt-BR'), '9 de setembro de 2025');
  });
});

describe('topicsOf', () => {
  it('returns each topic once, in first-seen order', () => {
    assert.deepEqual(topicsOf([{ topic: 'ai' }, { topic: 'security' }, { topic: 'ai' }]), [
      'ai',
      'security',
    ]);
  });
});
