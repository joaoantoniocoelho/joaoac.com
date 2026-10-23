import type { Locale } from './copy.ts';
import type { EditionSummary } from './editions.ts';

export type ArchiveDay = { date: string; day: string; weekday: string; articleCount: number };
export type ArchiveMonth = { label: string; days: ArchiveDay[] };

const intlLocale = (locale: Locale) => (locale === 'en' ? 'en-US' : 'pt-BR');
const noon = (date: string) => new Date(`${date}T12:00:00Z`);

// Editions arrive newest first; consecutive days of the same month share one heading.
export function groupByMonth(locale: Locale, editions: readonly EditionSummary[]): ArchiveMonth[] {
  const monthFormat = new Intl.DateTimeFormat(intlLocale(locale), {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const weekdayFormat = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    timeZone: 'UTC',
  });

  return editions.reduce<ArchiveMonth[]>((months, edition) => {
    const label = monthFormat.format(noon(edition.date)).toLocaleLowerCase(locale);
    const day: ArchiveDay = {
      date: edition.date,
      day: edition.date.slice(8),
      weekday: weekdayFormat.format(noon(edition.date)).toLocaleLowerCase(locale),
      articleCount: edition.article_count,
    };
    const last = months.at(-1);
    if (last?.label === label)
      return [...months.slice(0, -1), { label, days: [...last.days, day] }];
    return [...months, { label, days: [day] }];
  }, []);
}
