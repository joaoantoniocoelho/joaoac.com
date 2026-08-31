"use client";

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

const capabilities = [
  'Landing pages',
  'Backend systems',
  'Product experiences',
  'Cloud architecture',
  'AI experiments',
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [localTime, setLocalTime] = useState('--:--');
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.4 });
  const glowY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Sao_Paulo',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      );
    };

    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || event.pointerType === 'touch') return;

    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;

    pointerX.set(event.clientX - bounds.left - 260);
    pointerY.set(event.clientY - bounds.top - 260);
  };

  const revealTransition = {
    duration: prefersReducedMotion ? 0 : 0.85,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      data-ambient="sky"
      onPointerMove={handlePointerMove}
      className="editorial-grid relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.08] bg-black/70 pb-0 pt-28 md:pt-32"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { x: glowX, y: glowY }}
        className="pointer-events-none absolute left-0 top-0 hidden h-[32rem] w-[32rem] rounded-full bg-gradient-radial from-sky-300/[0.14] via-sky-500/[0.045] to-transparent blur-2xl lg:block"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[45%] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="pointer-events-none absolute left-7 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-zinc-700 xl:flex [writing-mode:vertical-rl]">
        Independent commissions · 2026
      </div>
      <div className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-zinc-700 xl:flex [writing-mode:vertical-rl]">
        Porto Alegre · Brazil
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-7xl flex-col justify-between px-6 sm:px-8 lg:px-10">
        <div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.05 }}
            className="mb-10 flex items-center justify-between border-b border-white/[0.08] pb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600 md:mb-14"
          >
            <span className="flex items-center gap-3 text-sky-300/80">
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ ...revealTransition, delay: 0.15 }}
                className="h-px w-8 origin-left bg-sky-300/60"
              />
              Software engineer
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.75)]" />
              Available for selected work
            </span>
          </motion.div>

          <div className="relative">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.1, delay: 0.45 }}
              className="text-outline pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(8rem,19vw,17rem)] font-bold leading-none tracking-[-0.08em] lg:block"
              aria-hidden="true"
            >
              ENGINEER
            </motion.span>

            <h1 className="relative mx-auto max-w-6xl text-center text-[clamp(4.4rem,11.5vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.07em] text-white">
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: '110%' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...revealTransition, delay: 0.12 }}
                  className="block"
                >
                  João
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, y: '110%' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...revealTransition, delay: 0.22 }}
                  className="block"
                >
                  Coelho
                  <motion.span
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }}
                    animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.3, 1] }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: 0.92 }}
                    className="inline-block origin-bottom text-sky-300"
                  >
                    .
                  </motion.span>
                </motion.span>
              </span>
            </h1>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.5 }}
            className="mt-8 grid border-y border-white/[0.09] md:mt-12 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
          >
            <div className="flex flex-col justify-between py-7 md:border-r md:border-white/[0.09] md:py-9 md:pr-10">
              <p className="max-w-2xl text-xl font-medium leading-[1.45] tracking-[-0.02em] text-zinc-200 sm:text-2xl md:text-3xl">
                I design and engineer digital experiences that feel sharp, useful, and unmistakably considered.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="pressable focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
                >
                  Start a project
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#experience"
                  className="pressable focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Explore my work
                  <FiArrowDown className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="micro-grid relative flex flex-col justify-between overflow-hidden border-t border-white/[0.09] py-7 md:border-t-0 md:py-9 md:pl-10">
              <div className="relative">
                <div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  <span>Current signal</span>
                  <span>{localTime} BRT</span>
                </div>
                <p className="max-w-md text-sm leading-7 text-zinc-400 md:text-base md:leading-8">
                  Backend systems, cloud, AI and refined landing pages for people with something worth launching.
                </p>
              </div>
              <a
                href="mailto:joaoantonioscoelho@gmail.com?subject=Landing%20page%20project"
                className="focus-ring group relative mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-xs uppercase tracking-[0.16em] text-sky-200/80 transition-colors hover:text-sky-200"
              >
                Landing page commissions open
                <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.8 }}
          className="marquee-mask mt-10 overflow-hidden border-t border-white/[0.08] py-5"
          aria-label="Capabilities"
        >
          <div className="marquee-track flex w-max text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={group === 1}>
                {capabilities.map((capability) => (
                  <span key={`${group}-${capability}`} className="flex items-center gap-8">
                    {capability}
                    <span className="h-1 w-1 rounded-full bg-sky-300/60" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
