'use client';

import { useEffect } from 'react';
import { rememberEntryAttribution } from '../lib/entry-attribution';

// Mounted once in the root layout so the first attributed URL of the session is kept even when the reader
// lands on a page without a signup form (e.g. the archive) and subscribes after internal navigation.
export function EntryAttributionCapture() {
  useEffect(() => { rememberEntryAttribution(window.location.href); }, []);
  return null;
}
