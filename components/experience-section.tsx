"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronDown, FiExternalLink } from 'react-icons/fi';
import experiencesData from '@/data/experiences.json';

const DESCRIPTION_PREVIEW_LENGTH = 360;

export function ExperienceSection() {
  const featuredExperiences = experiencesData.experiences.slice(0, 2);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpandedItems((current) => ({ ...current, [index]: !current[index] }));
  };

  return (
    <section id="experience" className="relative overflow-hidden bg-black py-28 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[minmax(240px,0.65fr)_minmax(0,1.35fr)] lg:gap-24">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true, amount: 0.4 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300/80">
              <span className="h-px w-8 bg-emerald-300/60" />
              Experience
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Where I&apos;ve worked<span className="text-emerald-300">.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-zinc-400">
              A few of the teams, products, and problems that shaped how I build software today.
            </p>
            <a
              href="/experiences"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              View all experiences
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.header>

          <div className="border-t border-white/10">
            {featuredExperiences.map((experience, index) => {
              const isExpanded = expandedItems[index];
              const shouldTruncate = experience.description.length > DESCRIPTION_PREVIEW_LENGTH;
              const description =
                isExpanded || !shouldTruncate
                  ? experience.description
                  : `${experience.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;

              return (
                <motion.article
                  key={`${experience.company}-${experience.period}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="group relative border-b border-white/10 py-10 md:py-12"
                >
                  <div className="grid gap-6 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
                    <div className="flex items-start justify-between sm:block">
                      <span className="font-mono text-xs tracking-wider text-zinc-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs leading-5 text-zinc-500 sm:mt-5 sm:block">
                        {experience.period}
                      </span>
                    </div>

                    <div>
                      <div className="mb-5">
                        <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                          {experience.title}
                        </h3>
                        {experience.companyUrl ? (
                          <a
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
                          >
                            {experience.company}
                            <FiExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <p className="mt-2 text-sm text-zinc-400">{experience.company}</p>
                        )}
                      </div>

                      <p className="text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
                        {description}
                      </p>

                      {shouldTruncate && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(index)}
                          aria-expanded={isExpanded}
                          className="group/button mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-white"
                        >
                          {isExpanded ? 'Show less' : 'Keep reading'}
                          <FiChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : 'group-hover/button:translate-y-0.5'
                            }`}
                          />
                        </button>
                      )}

                      <div className="mt-7 flex flex-wrap gap-2">
                        {experience.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 transition-colors duration-300 hover:border-white/20 hover:text-zinc-200"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
