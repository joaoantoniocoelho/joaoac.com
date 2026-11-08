// me.joaoac.com shows the /links page under its own short address. The content stays in the static
// site (which cannot route by hostname), so a deploy of the site updates both addresses.
const ME_ORIGIN = 'https://me.joaoac.com';
const SITE_ORIGIN = 'https://www.joaoac.com';

const PAGE_SOURCES: Record<string, string> = {
  '/': '/links',
  '/pt-BR': '/pt-BR/links',
};

// The page's language switch links to the paths it has on the main site.
const PAGE_ALIASES: Record<string, string> = {
  '/links': '/',
  '/pt-BR/links': '/pt-BR',
};

const FILE_PATH = /\/[^/]*\.[a-z0-9]+$/i;

export type Route = { action: 'proxy' | 'redirect'; url: string };

export function routeFor(requestUrl: string): Route {
  const { protocol, pathname, search } = new URL(requestUrl);
  if (protocol === 'http:') {
    return { action: 'redirect', url: `${ME_ORIGIN}${pathname}${search}` };
  }

  const path = pathname.replace(/\/+$/, '') || '/';

  const source = PAGE_SOURCES[path];
  if (source) return { action: 'proxy', url: `${SITE_ORIGIN}${source}${search}` };

  const alias = PAGE_ALIASES[path];
  if (alias) return { action: 'redirect', url: `${ME_ORIGIN}${alias}${search}` };

  // The page's fonts, styles and images must come from this origin: preloaded fonts are CORS
  // requests that a cross-origin redirect would break.
  if (FILE_PATH.test(pathname)) {
    return { action: 'proxy', url: `${SITE_ORIGIN}${pathname}${search}` };
  }

  return { action: 'redirect', url: `${SITE_ORIGIN}${pathname}${search}` };
}

export default {
  fetch(request: Request): Response | Promise<Response> {
    const route = routeFor(request.url);
    if (route.action === 'redirect') return Response.redirect(route.url, 308);
    return fetch(route.url, { method: request.method, headers: request.headers });
  },
};
