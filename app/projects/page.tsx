"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { ProjectStatusHeader } from '@/components/project-status';
import { projects, type Project } from '@/content/projects';
import { localizedPath, useLocale, type Locale } from '@/lib/i18n';

function copy(project: Project, locale: Locale) {
  return {
    oneLiner: project.oneLiner[locale],
    whatItDoes: project.whatItDoes[locale],
    decisions: project.decisions[locale],
  };
}

export default function ProjectsPage() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const homePath = localizedPath('/', locale);
  const prefersReducedMotion = useReducedMotion();

  return (
    <main data-ambient="violet" className="relative z-10 min-h-screen overflow-hidden bg-black/75 text-white">
      <div className="pointer-events-none absolute right-0 top-40 hidden h-96 w-96 translate-x-1/2 rounded-full bg-violet-500/[0.07] blur-[120px] lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-32 sm:px-8 md:pt-40 lg:px-10">
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-12 border-b border-white/10 pb-16 md:pb-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-end"
        >
          <div>
            <Link
              href={`${homePath}#projects`}
              className="pressable focus-ring group mb-12 inline-flex items-center gap-2 rounded-full text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              {pt ? 'Voltar ao início' : 'Back to home'}
            </Link>

            <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-violet-300/80">
              <span className="h-px w-8 bg-violet-300/60" />
              {pt ? 'Projetos pessoais' : 'Side projects'}
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-8xl">
              {pt ? 'Coisas que construí do zero' : <>Things I&apos;ve built from scratch</>}
              <span className="text-violet-300">.</span>
            </h1>
          </div>

          <div className="max-w-md lg:pb-2">
            <p className="text-base leading-8 text-zinc-400 md:text-lg">
              {pt
                ? 'Produtos que levei da ideia à produção sozinho - arquitetura, pipelines de IA, dados, interface e tudo no meio. Ambos estão no ar, ambos estão no começo.'
                : 'Products I took from idea to production on my own - architecture, AI pipelines, data, UI and everything in between. Both are live, both are early.'}
            </p>
            <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-zinc-600">
              <span>{projects.length} {pt ? 'produtos' : 'products'}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>{pt ? 'Em produção' : 'In production'}</span>
            </div>
          </div>
        </motion.header>

        <div className="min-w-0 space-y-8 pt-10 md:pt-14">
          {projects.map((project, index) => {
            const localized = copy(project, locale);
            return (
              <motion.article
                key={project.slug}
                className="min-w-0"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: Math.min(index * 0.08, 0.24) }}
                viewport={{ once: true, amount: 0.12 }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable focus-ring group block min-w-0 cursor-pointer rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 transition-colors duration-300 hover:border-violet-300/25 hover:bg-white/[0.05] sm:p-8 md:p-10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="min-w-0 flex-1">
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <ProjectStatusHeader
                        name={project.name}
                        titleAs="h2"
                        titleClassName="break-words text-3xl font-semibold tracking-tight text-white md:text-4xl"
                      />
                      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">{localized.oneLiner}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full text-sm text-zinc-300 transition-colors group-hover:text-white">
                      {project.urlLabel}
                      <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <div className="grid min-w-0 gap-10 pt-8 lg:grid-cols-2">
                    <div className="min-w-0">
                      <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                        {pt ? 'O que faz' : 'What it does'}
                      </h3>
                      <ul className="space-y-3 text-sm leading-7 text-zinc-400">
                        {localized.whatItDoes.map((item) => (
                          <li key={item} className="flex min-w-0 gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-300/80" />
                            <span className="min-w-0 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="min-w-0">
                      <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                        {pt ? 'Decisões' : 'What I learned / decisions'}
                      </h3>
                      <ul className="space-y-3 text-sm leading-7 text-zinc-400">
                        {localized.decisions.map((item) => (
                          <li key={item} className="flex min-w-0 gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-300/80" />
                            <span className="min-w-0 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-8 break-words border-t border-white/10 pt-6 font-mono text-xs leading-6 text-zinc-500">
                    {project.stack}
                  </p>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
