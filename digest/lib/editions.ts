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

export type EditionSummary = {
  date: string;
  article_count: number;
};

const apiUrl = process.env.NEXT_PUBLIC_DIGEST_API_URL?.replace(/\/+$/, '') ||
  'https://api.digest.joaoac.com';

export function safeArticleUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

export type EditionPage = {
  editions: EditionSummary[];
  page: number;
  has_more: boolean;
};

export async function getEditionPage(page: number): Promise<EditionPage> {
  const response = await fetch(`${apiUrl}/digests?page=${page}`, {
    next: { revalidate: 3600, tags: ['digest-editions'] },
  });
  if (!response.ok) throw new Error('Unable to load digest editions');
  const data: Partial<EditionPage> = await response.json();
  // An API without pagination would otherwise silently hide every edition past the first page.
  if (!Array.isArray(data.editions) || typeof data.page !== 'number' || typeof data.has_more !== 'boolean') {
    throw new Error('Unexpected digest editions response');
  }
  return { editions: data.editions, page: data.page, has_more: data.has_more };
}

export async function getEdition(date: string): Promise<PublicEdition | null> {
  const response = await fetch(`${apiUrl}/digests/${date}`, {
    next: { revalidate: 3600, tags: [`digest-edition:${date}`] },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load digest edition');
  return response.json();
}

export async function getLatestEdition(): Promise<PublicEdition | null> {
  try {
    const { editions } = await getEditionPage(1);
    if (!editions.length) return null;
    return await getEdition(editions[0].date);
  } catch {
    return null;
  }
}
