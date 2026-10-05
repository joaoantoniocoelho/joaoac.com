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

export async function getEditions(): Promise<EditionSummary[]> {
  const response = await fetch(`${apiUrl}/digests`, {
    next: { revalidate: 3600, tags: ['digest-editions'] },
  });
  if (!response.ok) throw new Error('Unable to load digest editions');
  const data: { editions: EditionSummary[] } = await response.json();
  return data.editions;
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
    const editions = await getEditions();
    if (!editions.length) return null;
    return await getEdition(editions[0].date);
  } catch {
    return null;
  }
}
