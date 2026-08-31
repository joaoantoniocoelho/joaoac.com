"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

type AmbientTone = 'sky' | 'emerald' | 'amber' | 'indigo';

const ambientLayers: Record<AmbientTone, string> = {
  sky: 'from-sky-400/20 via-cyan-400/[0.08] to-transparent',
  emerald: 'from-emerald-400/20 via-teal-400/[0.08] to-transparent',
  amber: 'from-amber-300/[0.18] via-orange-400/[0.07] to-transparent',
  indigo: 'from-indigo-400/20 via-violet-400/[0.08] to-transparent',
};

function isAmbientTone(value: string | undefined): value is AmbientTone {
  return Boolean(value && value in ambientLayers);
}

export function AmbientBackground() {
  const [activeTone, setActiveTone] = useState<AmbientTone>('sky');
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>('[data-ambient]'));

    if (surfaces.length === 0) return;

    const visibleSurfaces = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSurfaces.set(entry.target, entry.intersectionRatio);
          } else {
            visibleSurfaces.delete(entry.target);
          }
        });

        const mostVisible = Array.from(visibleSurfaces.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
        const tone = (mostVisible as HTMLElement | undefined)?.dataset.ambient;

        if (isAmbientTone(tone)) setActiveTone(tone);
      },
      { rootMargin: '-18% 0px -42% 0px', threshold: [0.05, 0.2, 0.45, 0.7] },
    );

    surfaces.forEach((surface) => observer.observe(surface));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeTone}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: 'easeOut' }}
          className={`absolute -right-[18rem] top-[8vh] h-[52rem] w-[52rem] rounded-full bg-gradient-radial ${ambientLayers[activeTone]} blur-[100px] sm:-right-[12rem] lg:-right-[6rem]`}
        />
      </AnimatePresence>

      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: [0.1, 0.18, 0.1], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[24rem] -left-[20rem] h-[48rem] w-[48rem] rounded-full bg-gradient-radial from-white/[0.08] to-transparent blur-[120px]"
      />
    </div>
  );
}
