import type { APIRoute } from 'astro';
import { postsFor } from '../lib/content.ts';
import { sitemapXml } from '../lib/feeds.ts';
import { SITE_LAST_UPDATED, SITE_URL } from '../lib/site.ts';

const PAGES = ['/', '/experiences', '/projects', '/blog'];

export const GET: APIRoute = async () => {
  const posts = await postsFor('en');
  const xml = sitemapXml({
    siteUrl: SITE_URL,
    pages: PAGES,
    pagesUpdated: SITE_LAST_UPDATED,
    posts,
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
