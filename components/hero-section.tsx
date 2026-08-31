"use client";

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.4 });
  const glowY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.4 });

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
      className="relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.06] bg-black/75 py-28 md:py-32"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { x: glowX, y: glowY }}
        className="pointer-events-none absolute left-0 top-0 hidden h-[32rem] w-[32rem] rounded-full bg-gradient-radial from-sky-300/[0.13] via-sky-500/[0.05] to-transparent blur-2xl lg:block"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...revealTransition, delay: 0.05 }}
          className="mb-12 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-sky-300/80 md:mb-16"
        >
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ ...revealTransition, delay: 0.15 }}
            className="h-px w-8 origin-left bg-sky-300/60"
          />
          Software Engineer · Brazil
        </motion.div>

        <h1 className="mx-auto max-w-6xl text-center text-[clamp(4.25rem,12vw,10rem)] font-bold leading-[0.82] tracking-[-0.065em] text-white">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: '110%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.12 }}
              className="block"
            >
              João
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
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

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...revealTransition, delay: 0.48 }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-8 border-t border-white/10 pt-8 text-center md:mt-16 md:pt-10"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#experience"
              className="pressable focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
            >
              View my work
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="pressable focus-ring inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
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
