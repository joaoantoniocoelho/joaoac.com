// Browsers always revalidate (max-age=0) so a purge reaches readers right away; the edge keeps pages for an hour.
export const EDGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=300';
export const NO_STORE = 'no-store';

export function edgeCacheHeaders(tags: readonly string[]): Record<string, string> {
  return { 'Cache-Control': EDGE_CACHE_CONTROL, 'Cache-Tag': tags.join(',') };
}
