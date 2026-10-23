import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readingLog, type Book, type ReadingStatus } from '../data/bookshelf.ts';
import { shelfFrom } from './bookshelf.ts';

function book(slug: string, status: ReadingStatus): Book {
  return { slug, title: { en: slug, 'pt-BR': slug }, author: 'someone', status };
}

describe('shelfFrom', () => {
  it('orders the shelf as reading, next and finished', () => {
    const log = [book('done', 'finished'), book('queued', 'next'), book('open', 'reading')];
    assert.deepEqual(
      shelfFrom(log).map((entry) => entry.slug),
      ['open', 'queued', 'done'],
    );
  });

  it('shows the latest finished book and the current read', () => {
    const log = [
      book('old-read', 'finished'),
      book('abandoned', 'reading'),
      book('new-read', 'finished'),
      book('current', 'reading'),
    ];
    assert.deepEqual(
      shelfFrom(log).map((entry) => entry.slug),
      ['current', 'new-read'],
    );
  });

  it('takes the oldest book in the queue as next', () => {
    const log = [book('first-in-line', 'next'), book('later', 'next')];
    assert.deepEqual(
      shelfFrom(log).map((entry) => entry.slug),
      ['first-in-line'],
    );
  });

  it('is empty for an empty log', () => {
    assert.deepEqual(shelfFrom([]), []);
  });
});

describe('readingLog', () => {
  it('has unique slugs', () => {
    const slugs = readingLog.map((entry) => entry.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it('dates every finished book and only finished books', () => {
    for (const entry of readingLog) {
      assert.equal(entry.finishedIn !== undefined, entry.status === 'finished', entry.slug);
    }
  });

  it('writes titles and notes in both languages', () => {
    for (const entry of readingLog) {
      assert.ok(entry.title.en && entry.title['pt-BR'], entry.slug);
      if (entry.note) assert.ok(entry.note.en && entry.note['pt-BR'], entry.slug);
    }
  });
});
