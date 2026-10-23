import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { splitHighlight } from './highlight.ts';

describe('splitHighlight', () => {
  it('splits around the phrase', () => {
    assert.deepEqual(splitHighlight('a b c', 'b'), { before: 'a ', mark: 'b', after: ' c' });
  });

  it('handles a phrase at the start and at the end', () => {
    assert.deepEqual(splitHighlight('abc', 'a'), { before: '', mark: 'a', after: 'bc' });
    assert.deepEqual(splitHighlight('abc', 'c'), { before: 'ab', mark: 'c', after: '' });
  });

  it('leaves the text unmarked when the phrase is missing or empty', () => {
    assert.deepEqual(splitHighlight('abc', 'x'), { before: 'abc', mark: '', after: '' });
    assert.deepEqual(splitHighlight('abc', ''), { before: 'abc', mark: '', after: '' });
  });
});
