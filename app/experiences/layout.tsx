import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/experiences',
  title: 'Experience',
  description: "The teams, products, technical decisions, and lessons behind João Coelho's software engineering career.",
});

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
