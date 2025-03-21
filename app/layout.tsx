import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'João Coelho | Software Engineer',
  description: 'Personal portfolio of João Coelho, a software engineer passionate about backend and full-stack development.',
  metadataBase: new URL('https://joaoac.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joaoac.com',
    title: 'João Coelho | Software Engineer',
    description: 'Personal portfolio of João Coelho, a software engineer passionate about backend and full-stack development.',
    siteName: 'João Coelho'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'João Coelho | Software Engineer',
    description: 'Personal portfolio of João Coelho, a software engineer passionate about backend and full-stack development.'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black text-white overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}