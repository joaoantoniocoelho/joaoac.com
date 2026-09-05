import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { DocumentLocale } from '@/components/document-locale';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';
import { ichiroPreloadAssets } from '@/lib/ichiro-assets';

const AmbientBackground = dynamic(
  () => import('@/components/ambient-background').then((mod) => mod.AmbientBackground),
  { ssr: false },
);
const DeveloperCommandMenu = dynamic(
  () => import('@/components/developer-command-menu').then((mod) => mod.DeveloperCommandMenu),
  { ssr: false },
);
const IchiroGuide = dynamic(
  () => import('@/components/ichiro-guide').then((mod) => mod.IchiroGuide),
  { ssr: false },
);

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

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
    default: 'João Coelho | Software, systems & products',
    template: '%s | João Coelho',
  },
  description:
    'Software engineer at ADP, previously SAP and Bazk. I build backend systems, AI tools, and products of my own, and write about what I learn.',
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
    title: 'João Coelho | Software, systems & products',
    description: 'Building backend systems, AI tools, and products of my own. Currently at ADP; previously SAP and Bazk.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'João Coelho - Senior Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@joaoac_dev',
    title: 'João Coelho | Software, systems & products',
    description: 'Building backend systems, AI tools, and products of my own. Currently at ADP; previously SAP and Bazk.',
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
        {ichiroPreloadAssets.map((href, index) => (
          <link
            key={href}
            rel="preload"
            as="image"
            href={href}
            type="image/png"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        ))}
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AmbientBackground />
          <DocumentLocale />
          <Navbar />
          {children}
          <DeveloperCommandMenu />
          <IchiroGuide />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
