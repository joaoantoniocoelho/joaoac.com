import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticle } from '@/components/blog-article';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

type Params = { slug: string };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = getPostBySlug(params.slug, 'pt-BR');
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/pt-BR/blog/${post.slug}`,
      languages: {
        'en-US': `/blog/${post.slug}`,
        'pt-BR': `/pt-BR/blog/${post.slug}`,
        'x-default': `/blog/${post.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/pt-BR/blog/${post.slug}`,
      locale: 'pt_BR',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
  };
}

export default function BlogPostPagePtBr({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug, 'pt-BR');
  if (!post) notFound();
  return <BlogArticle post={post} locale="pt-BR" />;
}
