import { localizedPath, type Locale } from './locale.ts';
import { SITE_URL } from './site.ts';

export const TITLE_SUFFIX = ' | joão coelho';

export const HOME_TITLE = {
  en: 'joão coelho | software, systems & products',
  'pt-BR': 'joão coelho | software, sistemas e produtos',
} as const;

export const HOME_DESCRIPTION = {
  en: 'software engineer at ADP. i build software and write about what i learn along the way, from engineering to ai and security.',
  'pt-BR':
    'engenheiro de software na ADP. construo software e escrevo sobre o que aprendo pelo caminho, de engenharia a ia e segurança.',
} as const;

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

export type Alternate = { hreflang: string; href: string };

export function languageAlternates(path: string): Alternate[] {
  return [
    { hreflang: 'pt-BR', href: absoluteUrl(localizedPath(path, 'pt-BR')) },
    { hreflang: 'en-US', href: absoluteUrl(localizedPath(path, 'en')) },
    { hreflang: 'x-default', href: absoluteUrl(localizedPath(path, 'pt-BR')) },
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
