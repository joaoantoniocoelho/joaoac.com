import { isEditionDate, parsePage } from './digest-routes.ts';
import {
  loadEdition,
  loadEditionPage,
  type EditionPage,
  type Fetcher,
  type PublicEdition,
} from './editions.ts';

export type RouteResult<T> =
  { kind: 'ok'; value: T } | { kind: 'redirect' } | { kind: 'missing' } | { kind: 'unavailable' };

// Anything the API would reject goes back to the first page; a page past the end does not exist.
export async function archiveRoute(
  apiUrl: string,
  pageParam: string | null,
  fetcher?: Fetcher,
): Promise<RouteResult<EditionPage>> {
  const page = parsePage(pageParam ?? undefined);
  if (page === null) return { kind: 'redirect' };
  const loaded = await loadEditionPage(apiUrl, page, fetcher);
  if (!loaded.ok) return { kind: loaded.error };
  if (page > 1 && loaded.value.editions.length === 0) return { kind: 'missing' };
  return { kind: 'ok', value: loaded.value };
}

export async function editionRoute(
  apiUrl: string,
  date: string | undefined,
  fetcher?: Fetcher,
): Promise<RouteResult<PublicEdition>> {
  if (!date || !isEditionDate(date)) return { kind: 'missing' };
  const loaded = await loadEdition(apiUrl, date, fetcher);
  return loaded.ok ? { kind: 'ok', value: loaded.value } : { kind: loaded.error };
}
