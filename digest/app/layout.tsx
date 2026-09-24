import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-plex-sans', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-ibm-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://digest.joaoac.com'),
  title: { default: 'Tech Digest | João Coelho', template: '%s | Tech Digest' },
  description: 'Selected reading on software engineering and technology, delivered in a concise email.',
  openGraph: {
    title: 'Tech Digest',
    description: 'A little less noise. A little more signal.',
    type: 'website',
    url: 'https://digest.joaoac.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Digest',
    description: 'A little less noise. A little more signal.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><meta name="referrer" content="no-referrer" /></head><body className={`${plexSans.variable} ${plexMono.variable}`}>{children}</body></html>;
}
