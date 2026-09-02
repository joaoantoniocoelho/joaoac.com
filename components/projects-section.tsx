"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { ProjectStatusHeader } from '@/components/project-status';
import { projects } from '@/content/projects';
import { localizedPath, useLocale } from '@/lib/i18n';

export function ProjectsSection() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="projects" data-ambient="violet" className="relative overflow-hidden bg-black/75 py-28 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/20 to-transparent" />
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
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-violet-300/80">
                <span className="h-px w-8 bg-violet-300/60" />
                {pt ? 'Projetos pessoais' : 'Side projects'}
              </div>
            </div>
            <h2 className="max-w-4xl break-words text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl md:text-6xl lg:text-7xl">
              {pt ? 'Coisas que construí do zero' : <>Things I&apos;ve built from scratch</>}
              <span className="text-violet-300">.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
              {pt
                ? 'Produtos que levei da ideia à produção sozinho - arquitetura, pipelines de IA, dados, interface e tudo no meio. Ambos estão no ar, ambos estão no começo.'
                : 'Products I took from idea to production on my own - architecture, AI pipelines, data, UI and everything in between. Both are live, both are early.'}
            </p>
          </div>
          <Link
            href={localizedPath('/projects', locale)}
            className="pressable focus-ring group inline-flex items-center gap-2 rounded-full text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            {pt ? 'Ver projetos' : 'See projects'}
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.header>

        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.slug}
              className="min-w-0"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable focus-ring group flex h-full min-w-0 cursor-pointer flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-300 hover:border-violet-300/25 hover:bg-white/[0.05] md:p-8"
              >
                <div className="mb-5">
                  <ProjectStatusHeader name={project.name} />
                </div>
                <p className="text-sm leading-7 text-zinc-400">{project.oneLiner[locale]}</p>
                <ul className="mt-6 space-y-2.5 text-sm leading-6 text-zinc-500">
                  {project.whatItDoes[locale].slice(0, 2).map((item) => (
                    <li key={item} className="flex min-w-0 gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-300/70" />
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 break-words font-mono text-[11px] leading-5 text-zinc-600">{project.stack}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm text-zinc-300 transition-colors group-hover:text-white">
                  {project.urlLabel}
                  <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
