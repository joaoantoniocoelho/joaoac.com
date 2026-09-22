import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticle } from '@/components/blog-article';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { pageMetadata } from '@/lib/seo';

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = getPostBySlug(params.slug, 'pt-BR');
  if (!post) return {};

  return pageMetadata({
    locale: 'pt-BR',
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    ogType: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    tags: post.tags,
  });
}

export default function BlogPostPagePtBr({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug, 'pt-BR');
  if (!post) notFound();
  return <BlogArticle post={post} locale="pt-BR" />;
}
