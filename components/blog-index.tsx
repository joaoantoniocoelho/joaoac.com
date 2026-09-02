import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { formatPostDate } from '@/lib/format-post-date';
import { getAllPosts } from '@/lib/posts';
import { localizedPath, type Locale } from '@/lib/locale';

export function blogIndexMetadata(locale: Locale): Metadata {
  const isPt = locale === 'pt-BR';
  const path = localizedPath('/blog', locale);
  return {
    title: 'Blog',
    description: isPt
      ? 'Notas sobre engenharia backend, desenvolvimento assistido por IA e segurança de aplicações.'
      : 'Notes on backend engineering, AI-assisted development and application security.',
    alternates: {
      canonical: path,
      languages: {
        'en-US': '/blog',
        'pt-BR': '/pt-BR/blog',
        'x-default': '/blog',
      },
      types: {
        'application/rss+xml': '/feed.xml',
      },
    },
  };
}

export function BlogIndex({ locale }: { locale: Locale }) {
  const pt = locale === 'pt-BR';
  const posts = getAllPosts(locale);
  const homePath = localizedPath('/', locale);

  return (
    <main data-ambient="amber" className="relative z-10 min-h-screen overflow-hidden bg-black/75 text-white">
      <div className="pointer-events-none absolute right-0 top-40 hidden h-96 w-96 translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-[120px] lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-32 sm:px-8 md:pt-40 lg:px-10">
        <header className="grid gap-12 border-b border-white/10 pb-16 md:pb-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-end">
          <div>
            <Link
              href={`${homePath}#blog`}
              className="pressable focus-ring group mb-12 inline-flex items-center gap-2 rounded-full text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              {pt ? 'Voltar ao início' : 'Back to home'}
            </Link>
            <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-amber-300/80">
              <span className="h-px w-8 bg-amber-300/60" />
              Blog
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-8xl">
              {pt ? 'Sobre o que tenho escrito' : <>Things I&apos;ve been writing about</>}
              <span className="text-amber-300">.</span>
            </h1>
          </div>
          <p className="max-w-md text-base leading-8 text-zinc-400 md:text-lg">
            {pt
              ? 'Notas sobre engenharia backend, desenvolvimento assistido por IA e segurança de aplicações.'
              : 'Notes on backend engineering, AI-assisted development and application security.'}
          </p>
        </header>

        <div className="divide-y divide-white/10">
          {posts.map((post) => (
            <article key={post.slug} className="py-10 md:py-12">
              <Link
                href={localizedPath(`/blog/${post.slug}`, locale)}
                className="pressable focus-ring group block rounded-2xl p-1"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <time className="font-mono text-[11px] uppercase tracking-wider text-zinc-400" dateTime={post.date}>
                    {formatPostDate(post.date, locale)}
                  </time>
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="max-w-4xl text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-amber-100 md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">{post.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300">
                  {pt ? 'Ler artigo' : 'Read article'}
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
