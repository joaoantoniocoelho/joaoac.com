import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_LAST_UPDATED, SITE_URL } from '@/lib/site';

const routes = ['', '/experiences', '/projects', '/blog'];
const prefixes = ['', '/pt-BR'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = prefixes.flatMap((prefix) =>
    routes.map((route) => ({
      url: `${SITE_URL}${prefix}${route}`,
      lastModified: SITE_LAST_UPDATED,
    })),
  );

  const posts = getAllPosts('en').flatMap((post) => {
    const path = `/blog/${post.slug}`;
    return prefixes.map((prefix) => ({
      url: `${SITE_URL}${prefix}${path}`,
      lastModified: post.updated ?? post.date,
    }));
  });

  return [...pages, ...posts];
}
