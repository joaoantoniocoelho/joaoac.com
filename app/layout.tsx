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
  title: 'João Antonio Coelho | Software Engineer',
  description: 'Software Engineer specializing in Java, Node.js, TypeScript and Cloud Technologies',
  openGraph: {
    title: 'João Antonio Coelho | Software Engineer',
    description: 'Software Engineer specializing in Java, Node.js, TypeScript and Cloud Technologies',
    url: 'https://joaoac.dev',
    siteName: 'João Antonio Coelho Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'João Antonio Coelho | Software Engineer',
    description: 'Software Engineer specializing in Java, Node.js, TypeScript and Cloud Technologies',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c'],
  },
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