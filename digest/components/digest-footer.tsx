'use client';

import type { Locale } from '../lib/copy';
import { copy } from '../lib/copy';

export function DigestFooter({ locale }: { locale: Locale }) {
  return <footer className="footer">
    <span>© {new Date().getFullYear()} Tech Digest · {copy[locale].from}</span>
    <nav className="footer-links" aria-label={locale === 'en' ? 'João Coelho and social links' : 'João Coelho e redes sociais'}>
      <a href="https://joaoac.com" target="_blank" rel="noopener noreferrer">joaoac.com ↗</a>
      <a href="https://github.com/joaoantoniocoelho" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      <a href="https://x.com/joaoac_dev" target="_blank" rel="noopener noreferrer">X ↗</a>
    </nav>
  </footer>;
}
