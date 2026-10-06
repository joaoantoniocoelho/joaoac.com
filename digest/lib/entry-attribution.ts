import { parseStoredAttribution, urlAttribution, type AcquisitionFields } from './acquisition';

const storageKey = 'digest-entry-attribution';

// Storage can be blocked (private mode, strict policies); attribution is best effort, so failures are ignored.
export function rememberEntryAttribution(href: string): void {
  const attribution = urlAttribution(href);
  if (!attribution) return;
  try {
    if (sessionStorage.getItem(storageKey) !== null) return;
    sessionStorage.setItem(storageKey, JSON.stringify(attribution));
  } catch {}
}

export function readEntryAttribution(): AcquisitionFields | null {
  try {
    return parseStoredAttribution(sessionStorage.getItem(storageKey));
  } catch {
    return null;
  }
}
