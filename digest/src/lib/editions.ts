export type PublicArticle = {
  title: string;
  url: string;
  source: string;
  published_at: string | null;
  why_interesting: string | null;
  topics: string[];
};

export type PublicEdition = {
  date: string;
  articles: PublicArticle[];
  older_date: string | null;
  newer_date: string | null;
};

export type EditionSummary = { date: string; article_count: number };

export type EditionPage = { editions: EditionSummary[]; page: number; has_more: boolean };

export type Fetcher = (url: string) => Promise<Response>;

export type Loaded<T> = { ok: true; value: T } | { ok: false; error: 'missing' | 'unavailable' };

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const optionalDate = (value: unknown): string | null => (isDate(value) ? value : null);
const optionalString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

export function safeArticleUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function parseArticle(value: unknown): PublicArticle | null {
  if (!isRecord(value)) return null;
  const { title, url, source, topics } = value;
  if (typeof title !== 'string' || typeof url !== 'string' || typeof source !== 'string')
    return null;
  return {
    title,
    url,
    source,
    published_at: optionalString(value.published_at),
    why_interesting: optionalString(value.why_interesting),
    topics: Array.isArray(topics) ? topics.filter((topic) => typeof topic === 'string') : [],
  };
}

// The API is ours, but its responses are still checked: a malformed article is dropped, not rendered.
export function parseEdition(value: unknown): PublicEdition | null {
  if (!isRecord(value) || !isDate(value.date) || !Array.isArray(value.articles)) return null;
  const articles = value.articles.map(parseArticle).filter((article) => article !== null);
  return {
    date: value.date,
    articles,
    older_date: optionalDate(value.older_date),
    newer_date: optionalDate(value.newer_date),
  };
}

// A response without pagination fields would silently hide every edition past the first page.
export function parseEditionPage(value: unknown): EditionPage | null {
  if (!isRecord(value) || !Array.isArray(value.editions)) return null;
  if (typeof value.page !== 'number' || typeof value.has_more !== 'boolean') return null;
  const editions = value.editions.flatMap((edition: unknown) => {
    if (!isRecord(edition) || !isDate(edition.date) || typeof edition.article_count !== 'number') {
      return [];
    }
    return [{ date: edition.date, article_count: edition.article_count }];
  });
  return { editions, page: value.page, has_more: value.has_more };
}

async function load<T>(
  url: string,
  fetcher: Fetcher,
  parse: (value: unknown) => T | null,
): Promise<Loaded<T>> {
  try {
    const response = await fetcher(url);
    if (response.status === 404) return { ok: false, error: 'missing' };
    if (!response.ok) return { ok: false, error: 'unavailable' };
    const value = parse(await response.json());
    return value ? { ok: true, value } : { ok: false, error: 'unavailable' };
  } catch {
    return { ok: false, error: 'unavailable' };
  }
}

export function loadEditionPage(apiUrl: string, page: number, fetcher: Fetcher = fetch) {
  return load(`${apiUrl}/digests?page=${String(page)}`, fetcher, parseEditionPage);
}

export function loadEdition(apiUrl: string, date: string, fetcher: Fetcher = fetch) {
  return load(`${apiUrl}/digests/${date}`, fetcher, parseEdition);
}

export async function loadLatestEdition(
  apiUrl: string,
  fetcher: Fetcher = fetch,
): Promise<PublicEdition | null> {
  const page = await loadEditionPage(apiUrl, 1, fetcher);
  const latest = page.ok ? page.value.editions[0] : undefined;
  if (!latest) return null;
  const edition = await loadEdition(apiUrl, latest.date, fetcher);
  return edition.ok ? edition.value : null;
}
