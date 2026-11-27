export type Locale = 'en' | 'pt-BR';

// Portuguese lives at the unprefixed URLs; English sits under /en.
export const DEFAULT_LOCALE: Locale = 'pt-BR';

export function localeFromPathname(pathname: string | null): Locale {
  return pathname === '/en' || pathname?.startsWith('/en/') ? 'en' : DEFAULT_LOCALE;
}

export function isHomePath(pathname: string | null): boolean {
  return pathname === '/' || pathname === '/en';
}

// `path` is the unprefixed (Portuguese) path of a page.
export function localizedPath(path: string, locale: Locale): string {
  if (locale === 'pt-BR') return path || '/';
  if (!path || path === '/') return '/en';
  return `/en${path}`;
}

export function pathForLocale(pathname: string, locale: Locale): string {
  const basePath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return localizedPath(basePath, locale);
}
