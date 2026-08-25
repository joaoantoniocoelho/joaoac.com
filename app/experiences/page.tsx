"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import experiencesData from '@/data/experiences.json';

export default function ExperiencesPage() {
  const { experiences } = experiencesData;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-32 sm:px-8 md:pt-40 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-12 border-b border-white/10 pb-16 md:pb-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-end"
        >
          <div>
            <Link
              href="/#experience"
              className="group mb-12 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to home
            </Link>

            <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300/80">
              <span className="h-px w-8 bg-emerald-300/60" />
              Full timeline
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl md:text-8xl">
              The work behind the work<span className="text-emerald-300">.</span>
            </h1>
          </div>

          <div className="max-w-md lg:pb-2">
            <p className="text-base leading-8 text-zinc-400 md:text-lg">
              The teams, products, technical decisions, and lessons that have shaped the way I think about software.
            </p>
            <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-zinc-600">
              <span>{experiences.length} roles</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span>2018 — Now</span>
            </div>
          </div>
        </motion.header>

        <section aria-label="Professional experience timeline" className="relative">
          <div className="absolute bottom-0 left-[19px] top-0 hidden w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent md:block" />

          {experiences.map((experience, index) => (
            <motion.article
              key={`${experience.company}-${experience.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: Math.min(index * 0.08, 0.24) }}
              viewport={{ once: true, amount: 0.12 }}
              className="relative border-b border-white/10 py-14 md:py-20"
            >
              <div className="absolute left-3 top-[5.4rem] z-10 hidden h-4 w-4 rounded-full border border-white/25 bg-black md:block">
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,0.7)]" />
              </div>

              <div className="grid gap-8 md:grid-cols-[80px_minmax(0,1fr)] lg:grid-cols-[80px_minmax(0,1.25fr)_minmax(220px,0.55fr)] lg:gap-12">
                <span className="font-mono text-xs tracking-widest text-zinc-600">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {experience.period}
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                    {experience.title}
                  </h2>

                  {experience.companyUrl ? (
                    <a
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-3 inline-flex items-center gap-2 text-base text-zinc-300 transition-colors hover:text-white"
                    >
                      {experience.company}
                      <FiExternalLink className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-white" />
                    </a>
                  ) : (
                    <p className="mt-3 text-base text-zinc-300">{experience.company}</p>
                  )}

                  <p className="mt-8 text-base leading-8 text-zinc-400 md:text-lg md:leading-9">
                    {experience.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {experience.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 transition-colors duration-300 hover:border-white/20 hover:text-white"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                <aside className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    About the company
                  </p>
                  <p className="text-xs leading-6 text-zinc-500">{experience.companyInfo}</p>
                </aside>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-20 flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8 sm:p-10 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">What&apos;s next?</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Still building, still learning.
            </h2>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get in touch
            <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
