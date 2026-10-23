import { getCollection } from 'astro:content';
import type { Locale } from './locale.ts';
import { localizedPosts } from './posts.ts';

export async function postsFor(locale: Locale) {
  return localizedPosts(await getCollection('posts'), locale, import.meta.env.DEV);
}

export type SitePost = Awaited<ReturnType<typeof postsFor>>[number];
