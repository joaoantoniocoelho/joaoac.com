import assert from 'node:assert/strict';
import test from 'node:test';
import { favoriteFilms } from './films.ts';

test('favorite films identify the intended posters in both languages', () => {
  assert.deepEqual(
    favoriteFilms.map(({ slug, year }) => [slug, year]),
    [
      ['no-country-for-old-men', 2007],
      ['scarface', 1983],
      ['a-series-of-unfortunate-events', 2004],
    ],
  );
  for (const film of favoriteFilms) {
    assert.ok(film.title.en);
    assert.ok(film.title['pt-BR']);
  }
});
