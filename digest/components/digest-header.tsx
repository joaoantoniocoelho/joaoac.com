'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '../lib/copy';
import { homePath } from '../lib/digest-routes';

const locales = [
  { id: 'en' as const, short: 'EN', Flag: FlagUS },
  { id: 'pt-BR' as const, short: 'PT', Flag: FlagBR },
];

type HeaderLink = { href: string; label: string };

type DigestHeaderProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
  // Same page in the other locale; defaults to the other locale's landing page.
  alternatePath?: string;
  link?: HeaderLink;
};

export function DigestHeader({ locale, onLocaleChange, alternatePath, link }: DigestHeaderProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [optimisticLocale, setOptimisticLocale] = useState<Locale | null>(null);
  const [, startTransition] = useTransition();
  const shown = optimisticLocale ?? locale;
  const pt = shown === 'pt-BR';
  const nextLocale: Locale = pt ? 'en' : 'pt-BR';
  const nextPath = alternatePath ?? homePath(nextLocale);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frameId = 0;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => { setOptimisticLocale(null); }, [locale]);
  useEffect(() => { if (!onLocaleChange) router.prefetch(nextPath); }, [onLocaleChange, router, nextPath]);

  function toggle() {
    // alternatePath only points away from the current page's locale; a second click while that navigation is pending has nowhere to go.
    if (alternatePath && shown !== locale) return;
    setOptimisticLocale(nextLocale);
    if (onLocaleChange) {
      onLocaleChange(nextLocale);
      return;
    }
    const hash = window.location.hash;
    startTransition(() => router.push(`${nextPath}${hash}`, { scroll: false }));
  }

  return <nav className="digest-nav" aria-label={pt ? 'Navegação principal' : 'Main navigation'}>
    <div className={`digest-nav-inner${scrolled ? ' is-scrolled' : ''}`}>
      <a className="brand" href={homePath(shown)} aria-label={`Tech Digest, ${pt ? 'início' : 'home'}`}>
        <span className="brand-mark">TD</span>
        <span className="brand-name">Tech Digest</span>
      </a>
      <div className="digest-nav-actions">
      {link && <a className="digest-nav-link" href={link.href}>{link.label} →</a>}
      <button className="language-switch" type="button" role="switch" aria-checked={pt} aria-label={pt ? 'Mudar idioma para inglês' : 'Switch language to Portuguese'} title={pt ? 'Switch to English' : 'Mudar para português'} onClick={toggle}>
        <motion.span className="language-thumb" aria-hidden="true" initial={false} animate={{ x: pt ? '100%' : '0%' }} transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 190, damping: 26, mass: 1 }} />
        {locales.map(({ id, short, Flag }) => {
          const active = id === shown;
          return <span key={id} className={`language-option${active ? ' active' : ''}`}>
            <motion.span className="language-flag" initial={false} animate={{ scale: active ? 1 : .88, opacity: active ? 1 : .55 }} transition={{ duration: prefersReducedMotion ? 0 : .45, ease: [.22, 1, .36, 1] }}><Flag /></motion.span>
            {short}
          </span>;
        })}
      </button>
      </div>
    </div>
  </nav>;
}

function FlagUS() {
  const stars = [0, 1, 2].flatMap(row => [0, 1, 2, 3].map(column => ({ cx: 1.1 + column * 2 + (row % 2 === 1 ? 1 : 0), cy: 1.3 + row * 2.2 })));
  return <svg viewBox="0 0 18 13" className="flag-svg" aria-hidden="true">
    <rect width="18" height="13" fill="#fff" />
    {[0, 2, 4, 6, 8, 10, 12].map(y => <rect key={y} y={y} width="18" height="1" fill="#c8102e" />)}
    <rect width="8" height="7" fill="#0a3161" />
    {stars.map(({ cx, cy }) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.42" fill="#fff" />)}
  </svg>;
}

function FlagBR() {
  return <svg viewBox="0 0 18 13" className="flag-svg" aria-hidden="true">
    <clipPath id="digest-flag-br-globe"><circle cx="9" cy="6.5" r="2.9" /></clipPath>
    <rect width="18" height="13" fill="#009b3a" />
    <path d="M9 1.4 16.4 6.5 9 11.6 1.6 6.5Z" fill="#fedf00" />
    <circle cx="9" cy="6.5" r="2.9" fill="#002776" />
    <path d="M5.6 5.6c2.3-1 4.9-.6 6.8 1" stroke="#fff" strokeWidth="0.85" fill="none" clipPath="url(#digest-flag-br-globe)" />
  </svg>;
}
