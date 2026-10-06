import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';

function tokenMatches(provided: string, expected: string): boolean {
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.DIGEST_REVALIDATE_TOKEN;
  if (!secret) return Response.json({ ok: false }, { status: 503 });

  const authorization = request.headers.get('authorization') || '';
  const provided = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!provided || !tokenMatches(provided, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (typeof payload !== 'object' || payload === null || !('date' in payload) || !validDate(payload.date)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  const previousDate = 'previousDate' in payload ? payload.previousDate : null;
  if (previousDate !== null && !validDate(previousDate)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  revalidateTag('digest-editions', { expire: 0 });
  revalidateTag(`digest-edition:${payload.date}`, { expire: 0 });
  // The previous edition now links forward to the new one through its own newer_date.
  if (previousDate) revalidateTag(`digest-edition:${previousDate}`, { expire: 0 });
  for (const prefix of ['', '/pt-BR']) {
    revalidatePath(`${prefix}/digest`);
    revalidatePath(`${prefix}/digest/${payload.date}`);
    if (previousDate) revalidatePath(`${prefix}/digest/${previousDate}`);
  }
  revalidatePath('/');
  revalidatePath('/pt-BR');

  return Response.json({ ok: true });
}
