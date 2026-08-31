"use client";

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { pathForLocale, useLocale, type Locale } from '@/lib/i18n';

const LOCALES: { id: Locale; short: string; Flag: () => JSX.Element }[] = [
  { id: 'en', short: 'EN', Flag: FlagUS },
  { id: 'pt-BR', short: 'PT', Flag: FlagBR },
];

export function LanguageSwitch({ fullWidth = false }: { fullWidth?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [, startTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useState<Locale | null>(null);

  // The route eventually catches up with the optimistic thumb position.
  useEffect(() => {
    setOptimisticLocale(null);
  }, [locale]);

  const shown = optimisticLocale ?? locale;
  const pt = shown === 'pt-BR';
  const nextLocale: Locale = pt ? 'en' : 'pt-BR';
  const nextPath = pathForLocale(pathname, nextLocale);

  // Warm the other locale so the swap feels instant.
  useEffect(() => {
    router.prefetch(nextPath);
  }, [router, nextPath]);

  const toggle = () => {
    setOptimisticLocale(nextLocale);
    const hash = typeof window === 'undefined' ? '' : window.location.hash;
    startTransition(() => {
      router.push(`${nextPath}${hash}`, { scroll: false });
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={pt}
      aria-label={pt ? 'Mudar idioma para inglês' : 'Switch language to Portuguese'}
      title={pt ? 'Switch to English' : 'Mudar para português'}
      onClick={toggle}
      className={`focus-ring group relative isolate grid h-9 grid-cols-2 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03] p-1 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06] ${
        fullWidth ? 'w-full' : 'w-[7.25rem]'
      }`}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: pt ? '100%' : '0%' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 190, damping: 26, mass: 1 }
        }
        className="absolute bottom-1 left-1 top-1 -z-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-b from-white to-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]"
      />

      {LOCALES.map(({ id, short, Flag }) => {
        const active = id === shown;

        return (
          <span
            key={id}
            className={`pointer-events-none relative flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wide transition-colors duration-200 ${
              active ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}
          >
            <motion.span
              initial={false}
              animate={{
                scale: active ? 1 : 0.88,
                opacity: active ? 1 : 0.55,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <Flag />
            </motion.span>
            {short}
          </span>
        );
      })}
    </button>
  );
}

function FlagUS() {
  const stars = [0, 1, 2].flatMap((row) =>
    [0, 1, 2, 3].map((column) => ({
      cx: 1.1 + column * 2 + (row % 2 === 1 ? 1 : 0),
      cy: 1.3 + row * 2.2,
    }))
  );

  return (
    <svg viewBox="0 0 18 13" className="h-[13px] w-[18px] rounded-[3px] ring-1 ring-black/20" aria-hidden="true">
      <rect width="18" height="13" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="18" height="1" fill="#c8102e" />
      ))}
      <rect width="8" height="7" fill="#0a3161" />
      {stars.map(({ cx, cy }) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.42" fill="#fff" />
      ))}
    </svg>
  );
}

function FlagBR() {
  return (
    <svg viewBox="0 0 18 13" className="h-[13px] w-[18px] rounded-[3px] ring-1 ring-black/20" aria-hidden="true">
      <clipPath id="flag-br-globe">
        <circle cx="9" cy="6.5" r="2.9" />
      </clipPath>
      <rect width="18" height="13" fill="#009b3a" />
      <path d="M9 1.4 16.4 6.5 9 11.6 1.6 6.5Z" fill="#fedf00" />
      <circle cx="9" cy="6.5" r="2.9" fill="#002776" />
      <path
        d="M5.6 5.6c2.3-1 4.9-.6 6.8 1"
        stroke="#fff"
        strokeWidth="0.85"
        fill="none"
        clipPath="url(#flag-br-globe)"
      />
    </svg>
  );
}
