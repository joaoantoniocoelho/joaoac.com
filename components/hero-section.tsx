"use client";

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useLocale } from '@/lib/i18n';

export function HeroSection() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
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
          {pt ? 'Engenheiro de Software · Brasil' : 'Software Engineer · Brazil'}
        </motion.div>

        <h1 className="mx-auto max-w-6xl text-center text-[clamp(4.25rem,12vw,10rem)] font-bold leading-[0.82] tracking-[-0.065em] text-white">
          <FocusInWord word="João" delay={0.12} reducedMotion={Boolean(prefersReducedMotion)} />
          <FocusInWord word="Coelho" delay={0.32} reducedMotion={Boolean(prefersReducedMotion)}>
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }}
              animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.3, 1] }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: 1.05 }}
              className="inline-block origin-bottom text-sky-300"
            >
              .
            </motion.span>
          </FocusInWord>
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
              {pt ? 'Veja meu trabalho' : 'View my work'}
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="pressable focus-ring inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            >
              {pt ? 'Mais sobre mim' : 'More about me'}
            </a>
          </div>

          <div className="flex items-end justify-center gap-8">
            <p className="max-w-md text-sm leading-7 text-zinc-500">
              {pt
                ? 'Construindo software com cuidado, de sistemas backend e nuvem a IA e tudo que existe entre eles.'
                : 'Building thoughtful software across backend systems, cloud, AI, and everything in between.'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FocusInWord({
  word,
  delay,
  reducedMotion,
  children,
}: {
  word: string;
  delay: number;
  reducedMotion: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.span
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        visible: { transition: { delayChildren: delay, staggerChildren: reducedMotion ? 0 : 0.045 } },
      }}
      aria-label={word}
      className="block pb-[0.08em]"
    >
      {word.split('').map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, filter: 'blur(16px)', scale: 1.06 },
            visible: { opacity: 1, filter: 'blur(0px)', scale: 1 },
          }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block will-change-[filter,opacity,transform]"
        >
          {letter}
        </motion.span>
      ))}
      {children}
    </motion.span>
  );
}
