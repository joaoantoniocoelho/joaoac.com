import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'John Doe | Full Stack Developer',
  description: 'Full Stack Developer specializing in React, Node.js, and Cloud Technologies',
  openGraph: {
    title: 'John Doe | Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Node.js, and Cloud Technologies',
    url: 'https://johndoe.dev',
    siteName: 'John Doe Portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        width: 1200,
        height: 630,
        alt: 'John Doe - Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe | Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Node.js, and Cloud Technologies',
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
      <body className={`${jetbrainsMono.className} min-h-screen bg-black text-white`}>
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