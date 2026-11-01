// Runs on every page: remembers the first UTM values a visitor arrived with, so they still count
// if they browse around before joining the waitlist.
import {
  UTM_STORAGE_KEY,
  mergeFirstTouch,
  sanitizeUtm,
  utmFromSearch,
  type Utm,
} from '../lib/utm.ts';

export function readStoredUtm(): Utm {
  try {
    return sanitizeUtm(JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) ?? 'null'));
  } catch {
    return {};
  }
}

const current = utmFromSearch(location.search);
if (Object.keys(current).length > 0) {
  try {
    localStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify(mergeFirstTouch(readStoredUtm(), current)),
    );
  } catch {
    /* storage blocked: attribution is best effort */
  }
}
