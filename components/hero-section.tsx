"use client";

import { useEffect, useRef } from 'react';
import {
  animate,
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
  const glowTargetX = useMotionValue(0);
  const glowTargetY = useMotionValue(0);
  const glowX = useSpring(glowTargetX, { stiffness: 45, damping: 20, mass: 0.7 });
  const glowY = useSpring(glowTargetY, { stiffness: 45, damping: 20, mass: 0.7 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const glowSize = 512;
    const initialX = Math.max(0, (bounds.width - glowSize) / 2);
    const initialY = Math.max(0, (bounds.height - glowSize) / 2);
    glowTargetX.set(initialX);
    glowTargetY.set(initialY);

    let timeoutId: ReturnType<typeof setTimeout>;
    let xAnimation: ReturnType<typeof animate> | undefined;
    let yAnimation: ReturnType<typeof animate> | undefined;

    const moveGlow = () => {
      const currentBounds = sectionRef.current?.getBoundingClientRect();
      if (!currentBounds) return;

      const maxX = Math.max(0, currentBounds.width - glowSize);
      const maxY = Math.max(0, currentBounds.height - glowSize);
      const duration = 5 + Math.random() * 3;
      const targetX = maxX * (0.12 + Math.random() * 0.76);
      const targetY = maxY * (0.18 + Math.random() * 0.56);
      const transition = { duration, ease: [0.45, 0, 0.55, 1] as [number, number, number, number] };

      xAnimation = animate(glowTargetX, targetX, transition);
      yAnimation = animate(glowTargetY, targetY, transition);
      timeoutId = setTimeout(moveGlow, duration * 1000);
    };

    moveGlow();

    return () => {
      clearTimeout(timeoutId);
      xAnimation?.stop();
      yAnimation?.stop();
    };
  }, [glowTargetX, glowTargetY, prefersReducedMotion]);

  const revealTransition = {
    duration: prefersReducedMotion ? 0 : 0.85,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      data-ambient="sky"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.06] bg-black/75 py-28 md:py-32"
    >
      <noscript>
        <style>{`.hero-letter{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>
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
          {pt ? 'Engenheiro de Software Sênior · Porto Alegre, Brasil' : 'Senior Software Engineer · Porto Alegre, Brazil'}
        </motion.div>

        <h1 aria-label="João Coelho." className="mx-auto max-w-6xl text-center text-[clamp(4.25rem,12vw,10rem)] font-bold leading-[0.82] tracking-[-0.065em] text-white">
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
              href="#blog"
              className="pressable focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
            >
              {pt ? 'Ler o blog' : 'Read the blog'}
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/resume"
              className="pressable focus-ring inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            >
              {pt ? 'Baixar currículo' : 'Download resume'}
            </a>
          </div>

          <div className="flex items-end justify-center gap-8">
            <p className="max-w-xl text-sm leading-7 text-zinc-500">
              {pt
                ? 'Construo sistemas backend, infraestrutura em nuvem e ferramentas de IA - e escrevo sobre o que aprendo no caminho.'
                : 'I build backend systems, cloud infrastructure and AI tooling - and write about what I learn along the way.'}
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
          className="hero-letter inline-block will-change-[filter,opacity,transform]"
        >
          {letter}
        </motion.span>
      ))}
      {children}
    </motion.span>
  );
}
