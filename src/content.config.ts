import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // Ids keep the file name as is (e.g. "slug.pt-BR"), so translations pair up with their English post.
  loader: glob({
    pattern: '*.mdx',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
