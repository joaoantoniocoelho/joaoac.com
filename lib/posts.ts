import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { type PostSummary } from '@/lib/format-post-date';
import type { Locale } from '@/lib/locale';

const postsDirectory = path.join(process.cwd(), 'content/posts');

const postFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  tags: z.array(z.string()),
  draft: z.boolean().optional().default(false),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
};

export type { PostSummary };

function parsePostFile(filename: string): Post {
  const slug = filename.replace(/\.pt-BR\.mdx$/, '').replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(postsDirectory, filename), 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = postFrontmatterSchema.parse(data);

  return { slug, content, ...frontmatter };
}

function englishFilename(filename: string) {
  return filename.endsWith('.mdx') && !filename.endsWith('.pt-BR.mdx');
}

export function getAllPosts(locale: Locale = 'en'): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter(englishFilename)
    .map((filename) => {
      const english = parsePostFile(filename);
      if (locale !== 'pt-BR') return english;

      const portugueseFilename = `${english.slug}.pt-BR.mdx`;
      if (!filenames.includes(portugueseFilename)) return english;

      const portuguese = parsePostFile(portugueseFilename);
      return {
        ...portuguese,
        slug: english.slug,
        date: english.date,
        updated: english.updated,
        draft: english.draft,
      };
    })
    .filter((post) => (process.env.NODE_ENV === 'production' ? !post.draft : true))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostSummaries(locale: Locale = 'en'): PostSummary[] {
  return getAllPosts(locale).map(({ content: _content, ...summary }) => summary);
}

export function getPostBySlug(slug: string, locale: Locale = 'en'): Post | undefined {
  return getAllPosts(locale).find((post) => post.slug === slug);
}
