import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EDGE_CACHE_CONTROL, edgeCacheHeaders } from './cache-headers.ts';

describe('edgeCacheHeaders', () => {
  it('caches at the edge only and tags the response for purging', () => {
    assert.deepEqual(edgeCacheHeaders(['digest-editions', 'digest-edition-2026-10-22']), {
      'Cache-Control': EDGE_CACHE_CONTROL,
      'Cache-Tag': 'digest-editions,digest-edition-2026-10-22',
    });
    assert.match(EDGE_CACHE_CONTROL, /max-age=0/);
  });
});
