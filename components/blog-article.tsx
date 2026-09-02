import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft } from 'react-icons/fi';
import { mdxComponents } from '@/components/mdx-components';
import { formatPostDate } from '@/lib/format-post-date';
import { type Post } from '@/lib/posts';
import { localizedPath, type Locale } from '@/lib/locale';
import { SITE_AUTHOR, SITE_URL } from '@/lib/site';

export async function BlogArticle({ post, locale }: { post: Post; locale: Locale }) {
  const pt = locale === 'pt-BR';
  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const url = `${SITE_URL}${localizedPath(`/blog/${post.slug}`, locale)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    url,
    inLanguage: pt ? 'pt-BR' : 'en-US',
    keywords: post.tags.join(', '),
  };

  return (
    <main data-ambient="amber" className="relative z-10 min-h-screen overflow-hidden bg-black/75 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none absolute right-0 top-40 hidden h-96 w-96 translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-[120px] lg:block" />

      <article className="relative mx-auto max-w-7xl px-6 pb-28 pt-32 sm:px-8 md:pt-40 lg:px-10">
        <header className="border-b border-white/10 pb-12 md:pb-16">
          <Link
            href={localizedPath('/blog', locale)}
            className="pressable focus-ring group mb-12 inline-flex items-center gap-2 rounded-full text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            {pt ? 'Voltar ao blog' : 'Back to blog'}
          </Link>

          <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-amber-300/80">
            <span className="h-px w-8 bg-amber-300/60" />
            Blog
          </div>

          <time className="block font-mono text-xs uppercase tracking-[0.16em] text-zinc-400" dateTime={post.date}>
            {formatPostDate(post.date, locale)}
          </time>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-[68ch] text-base leading-8 text-zinc-400 md:text-lg">{post.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose-post mx-auto max-w-[68ch] pt-12">{content}</div>
      </article>
    </main>
  );
}
