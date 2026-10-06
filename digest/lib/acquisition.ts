export type AcquisitionFields = {
  acquisition_source?: string;
  acquisition_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type QueryField = 'acquisition_source' | 'utm_source' | 'utm_medium' | 'utm_campaign';

// Same limits the backend truncates to, so a long campaign URL can never push the body past its size limit.
export const acquisitionLimits = { url: 2048, source: 64, utm: 128 } as const;

export const directSource = 'direct';

const queryFields: readonly (readonly [QueryField, string, number])[] = [
  ['acquisition_source', 'ref', acquisitionLimits.source],
  ['utm_source', 'utm_source', acquisitionLimits.utm],
  ['utm_medium', 'utm_medium', acquisitionLimits.utm],
  ['utm_campaign', 'utm_campaign', acquisitionLimits.utm],
];

const fieldLimits: Record<keyof AcquisitionFields, number> = {
  acquisition_source: acquisitionLimits.source,
  acquisition_url: acquisitionLimits.url,
  utm_source: acquisitionLimits.utm,
  utm_medium: acquisitionLimits.utm,
  utm_campaign: acquisitionLimits.utm,
};

const controlCharacters = /\p{Cc}/gu;

// Counts code points (not UTF-16 units) so a cut never splits an emoji, matching Python's str slicing on the backend.
export function sanitizeAttributionValue(value: string, maxLength: number): string | undefined {
  const cleaned = Array.from(value.replace(controlCharacters, '').trim()).slice(0, maxLength).join('');
  return cleaned || undefined;
}

// The query string is left out: ref and UTM travel as their own fields, and other tracking params only add size.
export function pageUrl(href: string): string | undefined {
  const url = parseUrl(href);
  if (!url) return undefined;
  return sanitizeAttributionValue(`${url.origin}${url.pathname}`, acquisitionLimits.url);
}

// Attribution carried by a URL (ref or any UTM), or null when the visit has none.
export function urlAttribution(href: string): AcquisitionFields | null {
  const url = parseUrl(href);
  if (!url) return null;
  const fromQuery = queryFields.flatMap(([field, param, limit]) => {
    const value = sanitizeAttributionValue(url.searchParams.get(param) ?? '', limit);
    return value ? [[field, value] as const] : [];
  });
  if (fromQuery.length === 0) return null;
  return withDefinedValues({ ...Object.fromEntries(fromQuery), acquisition_url: pageUrl(href) });
}

// The session's entry attribution wins over the current page, because internal links drop ref and UTM.
// A visit with no attribution at all is marked as direct to tell it apart from subscribers created before tracking.
export function acquisitionFields(currentHref: string, entry: AcquisitionFields | null): AcquisitionFields {
  const attribution = entry ?? urlAttribution(currentHref);
  if (attribution) return attribution;
  return withDefinedValues({ acquisition_source: directSource, acquisition_url: pageUrl(currentHref) });
}

// sessionStorage can hold anything, so every field is validated and limited again before it is trusted.
export function parseStoredAttribution(raw: string | null): AcquisitionFields | null {
  if (!raw) return null;
  const parsed = parseJson(raw);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
  const entries = Object.entries(parsed).flatMap(([key, value]) => {
    if (!isAcquisitionKey(key) || typeof value !== 'string') return [];
    const cleaned = sanitizeAttributionValue(value, fieldLimits[key]);
    return cleaned ? [[key, cleaned] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : null;
}

function isAcquisitionKey(key: string): key is keyof AcquisitionFields {
  return Object.prototype.hasOwnProperty.call(fieldLimits, key);
}

function withDefinedValues(fields: AcquisitionFields): AcquisitionFields {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
}

function parseUrl(href: string): URL | null {
  // URL.canParse is avoided because older Safari versions still in use do not support it.
  try {
    return new URL(href);
  } catch {
    return null;
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
