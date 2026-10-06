'use client';

import { useEffect } from 'react';
import type { Locale } from '../lib/copy';

// The root layout is shared by both locales, so the document language is set on the client, as the landing does.
export function DocumentLocale({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    // Storage can be blocked (private mode, strict policies); remembering the locale is only a convenience.
    try { localStorage.setItem('digest-locale', locale); } catch {}
  }, [locale]);
  return null;
}
