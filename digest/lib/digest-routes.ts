import type { Locale } from './copy';

export type SearchParams = Record<string, string | string[] | undefined>;

const localePrefix: Record<Locale, string> = { en: '', 'pt-BR': '/pt-BR' };

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt-BR' : 'en';
}

export function homePath(locale: Locale): string {
  return localePrefix[locale] || '/';
}

export function subscribePath(locale: Locale): string {
  return `${homePath(locale)}#subscribe`;
}

export function archivePath(locale: Locale, page = 1): string {
  const path = `${localePrefix[locale]}/digest`;
  return page > 1 ? `${path}?page=${page}` : path;
}

export function editionPath(locale: Locale, date: string): string {
  return `${localePrefix[locale]}/digest/${date}`;
}

// Returns null for anything the API would reject, so the page can redirect instead of erroring.
export function parsePage(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (typeof value !== 'string' || !/^[1-9]\d{0,5}$/.test(value)) return null;
  const page = Number(value);
  return page <= 100_000 ? page : null;
}

export function isEditionDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatEditionDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}
