"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { localizedPath, useLocale } from '@/lib/i18n';

export default function NotFound() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const homePath = localizedPath('/', locale);
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-black px-6 pb-16 pt-28 text-white sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/[0.05] blur-[120px] lg:block" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="border-y border-white/10 py-10 md:py-16"
        >
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-end">
            <div>
              <div className="mb-10 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-rose-300/80">
                <span className="h-px w-8 bg-rose-300/60" />
                Error 404
              </div>

              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
                {pt ? 'Rota não encontrada' : 'Route not found'}
              </p>
              <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-8xl">
                {pt ? 'Esta página não existe' : <>This page doesn&apos;t exist</>}
                <span className="text-white">.</span>
              </h1>
            </div>

            <div className="max-w-md lg:pb-2">
              <p className="text-base leading-8 text-zinc-400 md:text-lg">
                {pt ? 'O blog existe.' : 'The blog does.'}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={homePath}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {pt ? 'Voltar ao início' : 'Back home'}
                </Link>
                <Link
                  href={localizedPath('/blog', locale)}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  {pt ? 'Ler o blog' : 'Read the blog'}
                  <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={localizedPath('/experiences', locale)}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  {pt ? 'Experiência' : 'Experience'}
                  <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-700"
        >
          <span>joaoac.com</span>
          <span>404 / {pt ? 'Nada por aqui' : 'Nothing here'}</span>
        </motion.div>
      </div>
    </main>
  );
}
