import type { Metadata } from 'next';
import { localizedPath, type Locale } from '@/lib/locale';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';

export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'João Coelho - Senior Software Engineer',
} as const;

export const TITLE_TEMPLATE = '%s | João Coelho';

export const HOME_TITLE = {
  en: 'João Coelho | Software, systems & products',
  'pt-BR': 'João Coelho | Software, sistemas e produtos',
} as const;

export const HOME_DESCRIPTION = {
  en: 'Software engineer at ADP, previously SAP and Bazk. I build backend systems, AI tools, and products of my own, and write about what I learn.',
  'pt-BR':
    'Engenheiro de software na ADP, antes SAP e Bazk. Construo sistemas backend, ferramentas de IA e meus próprios produtos, e escrevo sobre o que aprendo.',
} as const;

export const HOME_OG_DESCRIPTION = {
  en: 'Building backend systems, AI tools, and products of my own. Currently at ADP; previously SAP and Bazk.',
  'pt-BR': 'Construindo sistemas backend, ferramentas de IA e meus próprios produtos. Hoje na ADP; antes, SAP e Bazk.',
} as const;

function languageAlternates(path: string) {
  const englishPath = path || '/';
  return {
    'en-US': englishPath,
    'pt-BR': localizedPath(englishPath, 'pt-BR'),
    'x-default': englishPath,
  };
}

export function absoluteUrl(path: string) {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: 'website' | 'profile' | 'article';
  rss?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  ogType,
  rss,
  publishedTime,
  modifiedTime,
  tags,
}: PageMetadataInput): Metadata {
  const isPt = locale === 'pt-BR';
  const canonical = localizedPath(path, locale);
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;
  const type = ogType ?? (path === '/' ? 'profile' : 'website');

  const openGraph =
    type === 'article'
      ? {
          type: 'article' as const,
          url: absoluteUrl(canonical),
          siteName: SITE_NAME,
          locale: isPt ? 'pt_BR' : 'en_US',
          alternateLocale: [isPt ? 'en_US' : 'pt_BR'],
          title: socialTitle,
          description: socialDescription,
          images: [OG_IMAGE],
          publishedTime,
          modifiedTime: modifiedTime ?? publishedTime,
          authors: [SITE_AUTHOR],
          tags,
        }
      : {
          type,
          url: absoluteUrl(canonical),
          siteName: SITE_NAME,
          locale: isPt ? 'pt_BR' : 'en_US',
          alternateLocale: [isPt ? 'en_US' : 'pt_BR'],
          title: socialTitle,
          description: socialDescription,
          images: [OG_IMAGE],
        };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
      ...(rss ? { types: { 'application/rss+xml': '/feed.xml' } } : {}),
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      creator: '@joaoac_dev',
      title: socialTitle,
      description: socialDescription,
      images: [OG_IMAGE.url],
    },
  };
}
