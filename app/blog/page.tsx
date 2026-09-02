import type { Metadata } from 'next';
import { blogIndexMetadata, BlogIndex } from '@/components/blog-index';

export const metadata: Metadata = blogIndexMetadata('en');

export default function BlogPage() {
  return <BlogIndex locale="en" />;
}
