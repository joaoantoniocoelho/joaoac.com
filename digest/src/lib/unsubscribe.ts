import type { Locale } from './copy.ts';

export const VALID_TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

export type UnsubscribeOutcome = 'success' | 'invalid' | 'unavailable';

export function unsubscribeUrl(apiUrl: string, token: string): string {
  return `${apiUrl}/unsubscribe/${encodeURIComponent(token)}`;
}

export function unsubscribeOutcome(status: number): UnsubscribeOutcome {
  if (status === 200) return 'success';
  if (status === 404) return 'invalid';
  return 'unavailable';
}

// The unsubscribe link has no language prefix, so the page follows the reader's saved choice, then the browser.
export function preferredLocale(saved: string | null, browserLanguage: string): Locale {
  if (saved === 'en' || saved === 'pt-BR') return saved;
  return browserLanguage.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}
