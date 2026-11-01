// UTM attribution shared by the browser (first-touch capture) and the Worker (validation).

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

export const UTM_STORAGE_KEY = 'porque_utm';
const MAX = 64;

/** Lowercase, keep [a-z0-9._-], collapse the rest to "-", cap at 64 chars. Empty → null. */
export function sanitizeUtmValue(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX)
    .replace(/-+$/, '');
  return value === '' ? null : value;
}

/** Picks only known, valid UTM keys from any object. */
export function sanitizeUtm(raw: unknown): Utm {
  const out: Utm = {};
  if (typeof raw !== 'object' || raw === null) return out;
  const source = new Map<string, unknown>(Object.entries(raw));
  for (const key of UTM_KEYS) {
    const value = sanitizeUtmValue(source.get(key));
    if (value) out[key] = value;
  }
  return out;
}

export function utmFromSearch(search: string): Utm {
  const params = new URLSearchParams(search);
  return sanitizeUtm(Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k)])));
}

/** First touch wins: stored values are kept; only absent keys are filled from the current URL. */
export function mergeFirstTouch(stored: Utm, current: Utm): Utm {
  return { ...current, ...stored };
}
