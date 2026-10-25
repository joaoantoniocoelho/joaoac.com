import assert from 'node:assert/strict';
import test from 'node:test';
import { favoriteAlbums } from './albums.ts';

test('favorite albums have unique covers, tracks, and Spotify destinations', () => {
  assert.deepEqual(
    favoriteAlbums.map(({ slug }) => slug),
    ['black-sabbath', 'rubber-soul', 'appetite-for-destruction'],
  );
  assert.deepEqual(
    favoriteAlbums.map(({ favoriteTrack }) => favoriteTrack.title),
    ['the wizard', 'nowhere man', 'nightrain'],
  );
  assert.equal(
    favoriteAlbums[0]?.favoriteTrack.spotifyUrl,
    'https://open.spotify.com/track/02VKxjok07ypt3oFlGRjmH',
  );
  for (const album of favoriteAlbums) {
    assert.match(album.spotifyUrl, /^https:\/\/open\.spotify\.com\/album\/[\w]+$/);
    assert.match(album.favoriteTrack.spotifyUrl, /^https:\/\/open\.spotify\.com\/track\/[\w]+$/);
  }
});
