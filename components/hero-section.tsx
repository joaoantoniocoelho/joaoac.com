"use client";

import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.06] bg-black py-28 md:py-32">
      <div className="pointer-events-none absolute right-[-10%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-sky-500/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-sky-300/80 md:mb-16"
        >
          <span className="h-px w-8 bg-sky-300/60" />
          Software Engineer · Brazil
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="mx-auto max-w-6xl text-center text-[clamp(4.25rem,12vw,10rem)] font-bold leading-[0.82] tracking-[-0.065em] text-white"
        >
          João
          <br />
          Coelho<span className="text-sky-300">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-8 border-t border-white/10 pt-8 text-center md:mt-16 md:pt-10"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              View my work
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            >
              More about me
            </a>
          </div>

          <div className="flex items-end justify-center gap-8">
            <p className="max-w-md text-sm leading-7 text-zinc-500">
              Building thoughtful software across backend systems, cloud, AI, and everything in between.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
