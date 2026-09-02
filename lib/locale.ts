export type Locale = 'en' | 'pt-BR';

export const DEFAULT_LOCALE: Locale = 'en';

export function localeFromPathname(pathname: string | null): Locale {
  return pathname === '/pt-BR' || pathname?.startsWith('/pt-BR/') ? 'pt-BR' : DEFAULT_LOCALE;
}

export function isHomePath(pathname: string | null): boolean {
  return pathname === '/' || pathname === '/pt-BR';
}

export function localizedPath(path: string, locale: Locale): string {
  if (locale === 'en') return path || '/';
  if (path === '/') return '/pt-BR';
  return `/pt-BR${path}`;
}

export function pathForLocale(pathname: string, locale: Locale): string {
  const englishPath = pathname.replace(/^\/pt-BR(?=\/|$)/, '') || '/';
  return localizedPath(englishPath, locale);
}
