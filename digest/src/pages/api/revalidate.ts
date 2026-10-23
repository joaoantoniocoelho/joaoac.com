import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  bearerToken,
  parseRevalidatePayload,
  tagsToPurge,
  tokenMatches,
} from '../../lib/revalidate.ts';

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Called by the Railway job after each daily send, with the new edition's date and the previous one.
export const POST: APIRoute = async ({ request, locals }) => {
  const secret = env.DIGEST_REVALIDATE_TOKEN;
  if (!secret) return json({ ok: false }, 503);
  if (!(await tokenMatches(bearerToken(request.headers.get('authorization')), secret))) {
    return json({ ok: false }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }
  const payload = parseRevalidatePayload(body);
  if (!payload) return json({ ok: false }, 400);

  // Present only when Workers Cache is enabled for the deployed Worker (it is absent in local dev).
  const cache = locals.cfContext.cache;
  if (!cache) {
    console.error('Cache purge skipped: Workers Cache is not available');
    return json({ ok: false }, 501);
  }
  try {
    const result = await cache.purge({ tags: tagsToPurge(payload) });
    if (!result.success) console.error('Cache purge failed', result.errors);
    return json({ ok: result.success }, result.success ? 200 : 502);
  } catch (error) {
    console.error('Cache purge failed', error);
    // Pages still expire on their own within the hour, so a failed purge only delays the update.
    return json({ ok: false }, 502);
  }
};
