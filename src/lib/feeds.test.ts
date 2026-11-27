import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rssXml, sitemapXml } from './feeds.ts';

const posts = [
  { slug: 'idor', title: 'Q&A <IDOR>', description: 'Why "IDs" leak', date: '2025-09-09' },
];

describe('rssXml', () => {
  const feed = (locale: 'en' | 'pt-BR') =>
    rssXml({ siteUrl: 'https://example.com', siteName: 'Site', author: 'Me', posts, locale });
  const xml = feed('pt-BR');

  it('links each post at its canonical URL', () => {
    assert.match(xml, /<link>https:\/\/example\.com\/blog\/idor<\/link>/);
    assert.match(xml, /<pubDate>Tue, 09 Sep 2025 00:00:00 GMT<\/pubDate>/);
    assert.match(xml, /<language>pt-BR<\/language>/);
  });

  it('points the english feed at the /en pages', () => {
    const english = feed('en');
    assert.match(english, /<link>https:\/\/example\.com\/en\/blog<\/link>/);
    assert.match(english, /<link>https:\/\/example\.com\/en\/blog\/idor<\/link>/);
    assert.match(english, /<language>en-US<\/language>/);
  });

  it('escapes text so titles cannot break the XML', () => {
    assert.match(xml, /<title>Q&amp;A &lt;IDOR&gt;<\/title>/);
    assert.match(xml, /Why &quot;IDs&quot; leak/);
  });
});

describe('sitemapXml', () => {
  const xml = sitemapXml({
    siteUrl: 'https://example.com',
    pages: ['/', '/blog'],
    pagesUpdated: '2026-10-01',
    posts: posts.map((post) => ({ ...post, updated: '2025-10-01' })),
  });

  it('lists every page in both languages', () => {
    for (const url of [
      'https://example.com<',
      'https://example.com/en<',
      'https://example.com/blog<',
      'https://example.com/en/blog<',
      'https://example.com/blog/idor<',
      'https://example.com/en/blog/idor<',
    ]) {
      assert.ok(xml.includes(`<loc>${url}`), url);
    }
  });

  it('uses the post update date when there is one', () => {
    assert.match(xml, /blog\/idor<\/loc>\n {4}<lastmod>2025-10-01/);
  });
});
