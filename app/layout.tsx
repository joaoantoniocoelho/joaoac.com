import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { AmbientBackground } from '@/components/ambient-background';
import { DeveloperCommandMenu } from '@/components/developer-command-menu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://joaoac.com'),
  title: 'João Coelho | Software Engineer & Digital Experiences',
  description: 'Software engineer building backend systems, cloud products, AI experiments, and refined landing pages.',
  keywords: [
    'Senior Software Engineer',
    'Full Stack Developer',
    'Node.js Developer',
    'React Developer',
    'TypeScript Developer',
    'AWS Cloud Engineer',
    'Enterprise Software',
    'Microservices Architecture',
    'Backend Developer',
    'Cloud Applications',
    'João Coelho Portfolio',
    'Software Engineer Brazil'
  ],
  authors: [{ name: 'João Antonio Stoll Coelho' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joaoac.com',
    title: 'João Coelho | Software Engineer & Digital Experiences',
    description: 'Backend systems, cloud products, AI experiments, and refined landing pages.',
    siteName: 'João Coelho Portfolio',
    images: [
      {
        url: '/og.png',
        width: 1672,
        height: 941,
        alt: 'João Coelho | Software Engineer · Digital Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'João Coelho | Software Engineer & Digital Experiences',
    description: 'Backend systems, cloud products, AI experiments, and refined landing pages.',
    creator: '@joaoac',
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <AmbientBackground />
          <Navbar />
          {children}
          <DeveloperCommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
