import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/projects',
  title: 'Projects',
  description: 'Products João Coelho built end to end, from idea to production.',
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
