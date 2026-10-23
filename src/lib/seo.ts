import { localizedPath, type Locale } from './locale.ts';
import { SITE_URL } from './site.ts';

export const TITLE_SUFFIX = ' | joão coelho';

export const HOME_TITLE = {
  en: 'joão coelho | software, systems & products',
  'pt-BR': 'joão coelho | software, sistemas e produtos',
} as const;

export const HOME_DESCRIPTION = {
  en: 'software engineer at ADP. i write about software, ai, and security, and build a few projects outside work.',
  'pt-BR':
    'engenheiro de software na ADP. escrevo sobre software, ia e segurança e faço alguns projetos fora do trabalho.',
} as const;

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

export type Alternate = { hreflang: string; href: string };

export function languageAlternates(englishPath: string): Alternate[] {
  return [
    { hreflang: 'en-US', href: absoluteUrl(englishPath) },
    { hreflang: 'pt-BR', href: absoluteUrl(localizedPath(englishPath, 'pt-BR')) },
    { hreflang: 'x-default', href: absoluteUrl(englishPath) },
  ];
}

export function pageTitle(title: string): string {
  return title.includes('joão coelho') ? title : `${title}${TITLE_SUFFIX}`;
}

export function ogLocale(locale: Locale): { locale: string; alternate: string } {
  return locale === 'pt-BR'
    ? { locale: 'pt_BR', alternate: 'en_US' }
    : { locale: 'en_US', alternate: 'pt_BR' };
}
