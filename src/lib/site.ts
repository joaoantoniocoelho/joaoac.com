export const SITE_URL = 'https://www.joaoac.com';
export const SITE_LAST_UPDATED = '2026-10-23';
export const SITE_NAME = 'joão coelho';
export const SITE_AUTHOR = 'João Antonio Stoll Coelho';
export const CONTACT_EMAIL = 'joao@joaoac.com';

// The digest has its own site; `ref` tells its analytics which part of this site sent the reader.
export function digestUrl(locale: 'en' | 'pt-BR', ref: string, path = ''): string {
  const prefix = locale === 'pt-BR' ? '/pt-BR' : '';
  return `https://digest.joaoac.com${prefix}${path || (prefix ? '' : '/')}?ref=${ref}`;
}
