// Bare and www-prefixed hosts only redirect, as they did on Vercel: www.joaoac.com is the site's
// canonical host and digest.joaoac.com is the digest's.
const CANONICAL_HOSTS: Record<string, string> = {
  'joaoac.com': 'www.joaoac.com',
  'www.digest.joaoac.com': 'digest.joaoac.com',
};
const FALLBACK_HOST = 'www.joaoac.com';

export function canonicalUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  url.hostname = CANONICAL_HOSTS[url.hostname] ?? FALLBACK_HOST;
  url.protocol = 'https:';
  url.port = '';
  return url.toString();
}

export default {
  fetch(request: Request): Response {
    return Response.redirect(canonicalUrl(request.url), 308);
  },
};
