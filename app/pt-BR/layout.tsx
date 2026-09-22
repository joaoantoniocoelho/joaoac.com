import type { Metadata } from 'next';
import { HOME_DESCRIPTION, HOME_OG_DESCRIPTION, HOME_TITLE, TITLE_TEMPLATE, pageMetadata } from '@/lib/seo';

const home = pageMetadata({
  locale: 'pt-BR',
  path: '/',
  title: HOME_TITLE['pt-BR'],
  description: HOME_DESCRIPTION['pt-BR'],
  ogDescription: HOME_OG_DESCRIPTION['pt-BR'],
  ogType: 'profile',
  rss: true,
});

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE['pt-BR'],
    template: TITLE_TEMPLATE,
  },
  description: home.description,
  alternates: home.alternates,
  openGraph: home.openGraph,
  twitter: home.twitter,
};

export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
