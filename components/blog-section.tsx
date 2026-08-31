"use client";

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { useLocale } from '@/lib/i18n';

interface BlogPost {
  title: string;
  date: string;
  preview: string;
  link: string;
  thumbnail: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const visiblePosts = posts.slice(0, 3);
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
                {pt ? 'Artigos' : 'Writing'}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 lg:hidden">03</span>
            </div>
            <h2 className="max-w-4xl break-words text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-6xl lg:text-7xl">
              {pt ? 'Assuntos sobre os quais tenho escrito' : <>Things I&apos;ve been writing about</>}<span className="text-amber-300">.</span>
            </h2>
          </div>
          <div className="lg:text-right">
            <div className="mb-5 hidden items-center justify-end gap-3 lg:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700">03 · {pt ? 'Notas de campo' : 'Field notes'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
            </div>
            <a
              href="https://medium.com/@joaoac"
              target="_blank"
              rel="noopener noreferrer"
              className="pressable focus-ring group inline-flex items-center gap-2 rounded-full text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {pt ? 'Todos os artigos no Medium' : 'All posts on Medium'}
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.header>

        {visiblePosts.length === 0 ? (
          <p className="py-16 text-sm text-zinc-500">{pt ? 'Nenhum artigo disponível no momento.' : 'No posts available at the moment.'}</p>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2 lg:grid-rows-2">
            {visiblePosts.map((post, index) => (
              <motion.article
                key={post.link}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className={`min-w-0 ${index === 0 ? 'lg:row-span-2' : ''}`}
              >
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pressable focus-ring group relative flex h-full w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-colors duration-300 hover:border-amber-300/25 ${
                    index === 0 ? 'min-h-[420px] flex-col sm:min-h-[480px]' : 'min-h-[210px] sm:min-h-[230px]'
                  }`}
                >
                  <span className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/60 font-mono text-[10px] text-zinc-500 backdrop-blur-md">
                    0{index + 1}
                  </span>
                  {post.thumbnail && (
                    <div
                      className={`relative overflow-hidden bg-zinc-950 ${
                        index === 0 ? 'h-52 w-full sm:h-64' : 'hidden w-[42%] shrink-0 sm:block'
                      }`}
                    >
                      <Image
                        src={post.thumbnail}
                        alt=""
                        fill
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                        sizes={index === 0 ? '(max-width: 1024px) 100vw, 50vw' : '25vw'}
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                    </div>
                  )}

                  <div className={`flex min-w-0 flex-1 flex-col justify-between ${index === 0 ? 'p-5 sm:p-7 md:p-8' : 'p-5 sm:p-6'}`}>
                    <div>
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                          {pt ? 'Sinal' : 'Signal'} · {post.date}
                        </span>
                        <FiArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                      </div>
                      <h3
                        className={`min-w-0 break-words font-semibold leading-tight tracking-tight text-zinc-100 transition-colors group-hover:text-white ${
                          index === 0 ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl'
                        }`}
                      >
                        {post.title}
                      </h3>
                    </div>
                    {post.preview && index === 0 && (
                      <p className="mt-6 line-clamp-3 text-sm leading-7 text-zinc-500">{post.preview}</p>
                    )}
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
