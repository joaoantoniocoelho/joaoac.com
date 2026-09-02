export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft?: boolean;
};

export function formatPostDate(date: string, locale: 'en' | 'pt-BR') {
  return new Date(`${date}T00:00:00`).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
