import assert from 'node:assert/strict';
import test from 'node:test';
import { favoriteAlbums } from './albums.ts';

test('favorite albums have unique covers, tracks, and Spotify destinations', () => {
  assert.deepEqual(
    favoriteAlbums.map(({ slug }) => slug),
    ['black-sabbath', 'rubber-soul', 'significant-other'],
  );
  assert.deepEqual(
    favoriteAlbums.map(({ favoriteTrack }) => favoriteTrack.title),
    ['the wizard', 'nowhere man', 'break stuff'],
  );
  for (const album of favoriteAlbums) {
    assert.match(album.spotifyUrl, /^https:\/\/open\.spotify\.com\/album\/[\w]+$/);
    assert.match(album.favoriteTrack.spotifyUrl, /^https:\/\/open\.spotify\.com\/track\/[\w]+$/);
  }
});
