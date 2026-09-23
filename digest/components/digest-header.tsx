'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '../lib/copy';

export function DigestHeader({ locale, onLocaleChange }: { locale: Locale; onLocaleChange?: (locale: Locale) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const otherLocale: Locale = locale === 'en' ? 'pt-BR' : 'en';

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <nav className="digest-nav" aria-label={locale === 'en' ? 'Main navigation' : 'Navegação principal'}>
    <div className={`digest-nav-inner${scrolled ? ' is-scrolled' : ''}`}>
      <a className="brand" href={locale === 'en' ? '/' : '/pt-BR'} aria-label={`Tech Digest, ${locale === 'en' ? 'home' : 'início'}`}>
        <span className="brand-mark">TD</span>
        <span className="brand-name">Tech Digest</span>
      </a>
      {onLocaleChange ? <button className="language-switch" type="button" role="switch" aria-checked={locale === 'pt-BR'} aria-label={locale === 'en' ? 'Switch language to Portuguese' : 'Mudar idioma para inglês'} onClick={() => onLocaleChange(otherLocale)}>
        <span className={`language-thumb${locale === 'pt-BR' ? ' is-pt' : ''}`} aria-hidden="true" />
        <span className={locale === 'en' ? 'active' : ''}>EN</span><span className={locale === 'pt-BR' ? 'active' : ''}>PT</span>
      </button> : <a className="language-switch" href={otherLocale === 'en' ? '/' : '/pt-BR'} aria-label={otherLocale === 'en' ? 'Switch language to English' : 'Mudar idioma para português'}>
        <span className={`language-thumb${locale === 'pt-BR' ? ' is-pt' : ''}`} aria-hidden="true" />
        <span className={locale === 'en' ? 'active' : ''}>EN</span><span className={locale === 'pt-BR' ? 'active' : ''}>PT</span>
      </a>}
    </div>
  </nav>;
}
