import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { DocumentLocale } from '@/components/document-locale';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';
import { bytePreloadAssets } from '@/lib/byte-assets';

const AmbientBackground = dynamic(
  () => import('@/components/ambient-background').then((mod) => mod.AmbientBackground),
  { ssr: false },
);
const DeveloperCommandMenu = dynamic(
  () => import('@/components/developer-command-menu').then((mod) => mod.DeveloperCommandMenu),
  { ssr: false },
);
const ByteGuide = dynamic(
  () => import('@/components/byte-guide').then((mod) => mod.ByteGuide),
  { ssr: false },
);

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: SITE_AUTHOR,
      alternateName: SITE_NAME,
      jobTitle: 'Senior Software Engineer',
      worksFor: { '@type': 'Organization', name: 'ADP' },
      url: SITE_URL,
      sameAs: [
        'https://linkedin.com/in/joaoac',
        'https://github.com/joaoantoniocoelho',
        'https://x.com/joaoac_dev',
      ],
      knowsAbout: [
        'Backend Engineering',
        'Distributed Systems',
        'AWS',
        'Node.js',
        'TypeScript',
        'Java',
        'Spring Boot',
        'AI Agents',
        'LLM Integration',
      ],
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'PUCRS' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Porto Alegre',
        addressRegion: 'RS',
        addressCountry: 'BR',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      author: { '@id': `${SITE_URL}/#person` },
      inLanguage: ['en-US', 'pt-BR'],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'João Coelho | Senior Software Engineer - Backend, Cloud & AI',
    template: '%s | João Coelho',
  },
  description:
    'Senior software engineer at ADP writing about backend systems, cloud infrastructure and AI-powered developer tooling. Previously SAP and fintech.',
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/', 'pt-BR': '/pt-BR', 'x-default': '/' },
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: SITE_NAME,
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    title: 'João Coelho | Senior Software Engineer',
    description: 'Backend systems, cloud infrastructure and AI-powered developer tooling.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'João Coelho - Senior Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@joaoac_dev',
    title: 'João Coelho | Senior Software Engineer',
    description: 'Backend systems, cloud infrastructure and AI-powered developer tooling.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {bytePreloadAssets.map((href, index) => (
          <link
            key={href}
            rel="preload"
            as="image"
            href={href}
            type="image/webp"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        ))}
      </head>
      <body className={inter.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AmbientBackground />
          <DocumentLocale />
          <Navbar />
          {children}
          <DeveloperCommandMenu />
          <ByteGuide />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
