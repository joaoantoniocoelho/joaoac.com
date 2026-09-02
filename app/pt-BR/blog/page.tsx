import type { Metadata } from 'next';
import { blogIndexMetadata, BlogIndex } from '@/components/blog-index';

export const metadata: Metadata = blogIndexMetadata('pt-BR');

export default function BlogPagePtBr() {
  return <BlogIndex locale="pt-BR" />;
}
