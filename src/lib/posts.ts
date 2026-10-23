import type { Locale } from './locale.ts';

export type PostData = {
  title: string;
  description: string;
  date: string;
  updated?: string | undefined;
  tags: string[];
  draft: boolean;
};

export type PostEntry = { id: string; data: PostData };

export type LocalizedPost<Entry extends PostEntry> = PostData & {
  slug: string;
  topic: string;
  entry: Entry;
};

const PORTUGUESE_SUFFIX = '.pt-BR';
const DEFAULT_TOPIC = 'engineering';

function isTranslation(entry: PostEntry): boolean {
  return entry.id.endsWith(PORTUGUESE_SUFFIX);
}

// Translations reuse the English publication dates and draft flag, so both languages stay in sync.
function localize<Entry extends PostEntry>(
  english: Entry,
  translation: Entry | undefined,
): LocalizedPost<Entry> {
  const source = translation ?? english;
  return {
    ...source.data,
    date: english.data.date,
    updated: english.data.updated,
    draft: english.data.draft,
    slug: english.id,
    topic: source.data.tags[0] ?? DEFAULT_TOPIC,
    entry: source,
  };
}

export function localizedPosts<Entry extends PostEntry>(
  entries: readonly Entry[],
  locale: Locale,
  includeDrafts: boolean,
): LocalizedPost<Entry>[] {
  const translations = new Map(
    entries
      .filter(isTranslation)
      .map((entry) => [entry.id.slice(0, -PORTUGUESE_SUFFIX.length), entry]),
  );

  return entries
    .filter((entry) => !isTranslation(entry))
    .map((english) =>
      localize(english, locale === 'pt-BR' ? translations.get(english.id) : undefined),
    )
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatPostDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
    .format(new Date(`${date}T12:00:00Z`))
    .toLocaleLowerCase(locale);
}

export function topicsOf(posts: readonly { topic: string }[]): string[] {
  return Array.from(new Set(posts.map((post) => post.topic)));
}
