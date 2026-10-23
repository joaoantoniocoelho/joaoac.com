import { localizedPath, type Locale } from './locale.ts';

export type FeedPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string | undefined;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

type RssInput = { siteUrl: string; siteName: string; author: string; posts: readonly FeedPost[] };

export function rssXml({ siteUrl, siteName, author, posts }: RssInput): string {
  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}/blog</link>
    <description>Notes on backend engineering, AI-assisted development and application security.</description>
    <language>en-US</language>
    <managingEditor>${escapeXml(author)}</managingEditor>
${items}
  </channel>
</rss>
`;
}

type SitemapInput = {
  siteUrl: string;
  pages: readonly string[];
  pagesUpdated: string;
  posts: readonly FeedPost[];
};

const LOCALES: Locale[] = ['en', 'pt-BR'];

export function sitemapXml({ siteUrl, pages, pagesUpdated, posts }: SitemapInput): string {
  const entries = [
    ...pages.map((path) => ({ path, lastModified: pagesUpdated })),
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: post.updated ?? post.date,
    })),
  ].flatMap(({ path, lastModified }) =>
    LOCALES.map((locale) => {
      const localized = localizedPath(path, locale);
      const url = localized === '/' ? siteUrl : `${siteUrl}${localized}`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}
