import { rememberEntryAttribution } from '../lib/entry-attribution.ts';

export const LOCALE_KEY = 'digest-locale';

// Runs on every page: keeps the first attributed URL of the visit, and the reader's language for pages
// that cannot tell it from the URL (the unsubscribe link has no language prefix).
export function startDigestPage(): void {
  rememberEntryAttribution(window.location.href);
  const locale = document.body.dataset.locale;
  if (!locale) return;
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Storage can be blocked; the preference is a convenience only.
  }
}
