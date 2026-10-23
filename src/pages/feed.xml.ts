import type { APIRoute } from 'astro';
import { postsFor } from '../lib/content.ts';
import { rssXml } from '../lib/feeds.ts';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '../lib/site.ts';

export const GET: APIRoute = async () => {
  const posts = await postsFor('en');
  return new Response(
    rssXml({ siteUrl: SITE_URL, siteName: SITE_NAME, author: SITE_AUTHOR, posts }),
    {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    },
  );
};
