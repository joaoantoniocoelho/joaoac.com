import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { DocumentLocale } from '@/components/document-locale';
import { CONTACT_EMAIL, SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';
import { HOME_DESCRIPTION, HOME_OG_DESCRIPTION, HOME_TITLE, TITLE_TEMPLATE, pageMetadata } from '@/lib/seo';
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
      image: `${SITE_URL}/avatar.png`,
      email: CONTACT_EMAIL,
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
      publisher: { '@id': `${SITE_URL}/#person` },
      inLanguage: ['en-US', 'pt-BR'],
    },
  ],
};

const home = pageMetadata({
  locale: 'en',
  path: '/',
  title: HOME_TITLE.en,
  description: HOME_DESCRIPTION.en,
  ogDescription: HOME_OG_DESCRIPTION.en,
  ogType: 'profile',
  rss: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE.en,
    template: TITLE_TEMPLATE,
  },
  description: home.description,
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: home.alternates,
  openGraph: home.openGraph,
  twitter: home.twitter,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.lang=location.pathname==='/pt-BR'||location.pathname.startsWith('/pt-BR/')?'pt-BR':'en';",
          }}
        />
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
