// Worker entry: only /api/* reaches this script (run_worker_first); everything else is static assets.
import { joinWaitlist, type WaitlistEnv } from '../lib/waitlist.ts';

interface Env extends WaitlistEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const STATUS_CODE = { subscribed: 201, already: 200, invalid: 400, error: 502 } as const;

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function handleWaitlist(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json({ status: 'error' }, 405);
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null) return json({ status: 'invalid' }, 400);
    data = Object.fromEntries(Object.entries(parsed));
  } catch {
    return json({ status: 'invalid' }, 400);
  }
  // Honeypot: humans never see this field. Pretend it worked so bots learn nothing.
  if (typeof data.site === 'string' && data.site !== '') return json({ status: 'subscribed' }, 201);
  try {
    const result = await joinWaitlist(data.email, env);
    return json(result, STATUS_CODE[result.status]);
  } catch {
    return json({ status: 'error' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/waitlist') return handleWaitlist(request, env);
    return env.ASSETS.fetch(request);
  },
};
