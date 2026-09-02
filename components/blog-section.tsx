"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { formatPostDate, type PostSummary } from '@/lib/format-post-date';
import { localizedPath, useLocale } from '@/lib/i18n';

export function BlogSection({ posts }: { posts: PostSummary[] }) {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="blog" data-ambient="amber" className="relative overflow-hidden bg-black/75 py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-10 grid min-w-0 gap-8 border-b border-white/10 pb-8 sm:mb-14 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div>
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-amber-300/80">
                <span className="h-px w-8 bg-amber-300/60" />
                03 · Blog
              </div>
            </div>
            <h2 className="max-w-4xl break-words text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-6xl lg:text-7xl">
              {pt ? 'Sobre o que tenho escrito' : <>Things I&apos;ve been writing about</>}
              <span className="text-amber-300">.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
              {pt
                ? 'Notas sobre engenharia backend, desenvolvimento assistido por IA e segurança de aplicações. Mais em breve.'
                : 'Notes on backend engineering, AI-assisted development and application security. More on the way.'}
            </p>
          </div>
          <Link
            href={localizedPath('/blog', locale)}
            className="pressable focus-ring group inline-flex items-center gap-2 rounded-full text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            {pt ? 'Todos os posts →' : 'All posts →'}
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.header>

        <div className="grid min-w-0 gap-5">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link
                href={localizedPath(`/blog/${post.slug}`, locale)}
                className="pressable focus-ring group flex h-full min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors duration-300 hover:border-amber-300/25 sm:p-7"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <time className="font-mono text-[11px] uppercase tracking-wider text-zinc-400" dateTime={post.date}>
                    {formatPostDate(post.date, locale)}
                  </time>
                  <span className="h-1 w-1 rounded-full bg-zinc-700" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="min-w-0 break-words text-xl font-semibold leading-tight tracking-tight text-zinc-100 transition-colors group-hover:text-white sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">{post.description}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
