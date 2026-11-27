import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  MAX_TYPING_MS,
  MS_PER_CHAR,
  charsShown,
  nextSuggestions,
  typingDuration,
} from './ichiro.ts';

type Id = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'secret';

const graph: Record<Id, { next: Id[] }> = {
  a: { next: ['b', 'c'] },
  b: { next: ['a', 'c'] },
  c: { next: ['d'] },
  d: { next: [] },
  e: { next: [] },
  f: { next: [] },
  secret: { next: [] },
};

const discoveryOrder: Id[] = ['d', 'e', 'f'];

describe('nextSuggestions', () => {
  it('offers the follow-ups first, then the discovery order, without repeats', () => {
    const ids = nextSuggestions({
      currentId: 'a',
      askedIds: ['a'],
      graph,
      discoveryOrder,
      secretId: 'secret',
    });
    assert.deepEqual(ids, ['b', 'c', 'd', 'e']);
  });

  it('never suggests a question that was already asked', () => {
    const ids = nextSuggestions({
      currentId: 'b',
      askedIds: ['a', 'b'],
      graph,
      discoveryOrder,
      secretId: 'secret',
    });
    assert.deepEqual(ids, ['c', 'd', 'e', 'f']);
  });

  it('unlocks the secret question after three questions', () => {
    const ids = nextSuggestions({
      currentId: 'c',
      askedIds: ['a', 'b', 'c'],
      graph,
      discoveryOrder,
      secretId: 'secret',
    });
    assert.deepEqual(ids, ['d', 'secret', 'e', 'f']);
  });

  it('returns nothing once every question was asked', () => {
    const everything: Id[] = ['a', 'b', 'c', 'd', 'e', 'f', 'secret'];
    const ids = nextSuggestions({
      currentId: 'd',
      askedIds: everything,
      graph,
      discoveryOrder,
      secretId: 'secret',
    });
    assert.deepEqual(ids, []);
  });
});

describe('typing', () => {
  it('shows nothing at the start and everything once the time is up', () => {
    const text = 'hello there';
    assert.equal(charsShown(text, 0), 0);
    assert.equal(charsShown(text, typingDuration(text)), text.length);
    assert.equal(charsShown(text, 999_999), text.length);
  });

  it('reveals the text gradually', () => {
    const text = 'a'.repeat(40);
    const halfway = charsShown(text, typingDuration(text) / 2);
    assert.ok(halfway > 0 && halfway < text.length);
  });

  it('caps how long a long answer takes', () => {
    assert.equal(typingDuration('a'.repeat(10_000)), MAX_TYPING_MS);
    assert.equal(typingDuration('abc'), 3 * MS_PER_CHAR);
  });
});
