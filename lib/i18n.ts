"use client";

import { usePathname } from 'next/navigation';
import { localeFromPathname, type Locale } from '@/lib/locale';

export type { Locale };
export { DEFAULT_LOCALE, isHomePath, localizedPath, pathForLocale } from '@/lib/locale';

export function useLocale(): Locale {
  return localeFromPathname(usePathname());
}
