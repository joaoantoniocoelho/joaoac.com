import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_LAST_UPDATED, SITE_URL } from '@/lib/site';

const routes = ['', '/experiences', '/projects', '/blog'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: SITE_LAST_UPDATED,
    alternates: {
      languages: {
        'en-US': `${SITE_URL}${route}`,
        'pt-BR': `${SITE_URL}/pt-BR${route}`,
        'x-default': `${SITE_URL}${route}`,
      },
    },
  }));

  const posts = getAllPosts('en').map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated ?? post.date,
    alternates: {
      languages: {
        'en-US': `${SITE_URL}/blog/${post.slug}`,
        'pt-BR': `${SITE_URL}/pt-BR/blog/${post.slug}`,
        'x-default': `${SITE_URL}/blog/${post.slug}`,
      },
    },
  }));

  return [...pages, ...posts];
}
