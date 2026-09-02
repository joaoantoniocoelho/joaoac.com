import { getAllPosts } from '@/lib/posts';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site';

export function GET() {
  const posts = getAllPosts('en');
  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on backend engineering, AI-assisted development and application security.</description>
    <language>en-US</language>
    <managingEditor>${SITE_AUTHOR}</managingEditor>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
