// Waitlist logic shared by the Worker endpoint and its tests. No secrets live here:
// everything comes from the Worker's env bindings.

export interface WaitlistEnv {
  RESEND_API_KEY?: string;
  /** Resend segment the contact joins (e.g. "General"). Optional: without it the contact is only global. */
  RESEND_SEGMENT_ID?: string;
  /** e.g. "por quê <ola@digest.joaoac.com>". Confirmation email is skipped when unset. */
  WAITLIST_FROM_EMAIL?: string;
}

export type WaitlistResult =
  { status: 'subscribed' } | { status: 'already' } | { status: 'invalid' } | { status: 'error' };

const RESEND = 'https://api.resend.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

type Fetch = typeof fetch;

export async function joinWaitlist(
  rawEmail: unknown,
  env: WaitlistEnv,
  doFetch: Fetch = fetch,
): Promise<WaitlistResult> {
  const email = normalizeEmail(rawEmail);
  if (!email) return { status: 'invalid' };
  const key = env.RESEND_API_KEY;
  if (!key) return { status: 'error' };
  const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  // Resend's create is idempotent (same id, 201), so look the contact up first to tell repeats apart.
  const found = await doFetch(`${RESEND}/contacts/${encodeURIComponent(email)}`, { headers });
  if (found.ok) return { status: 'already' };
  if (found.status !== 404) return { status: 'error' };

  const body: Record<string, unknown> = { email, unsubscribed: false };
  if (env.RESEND_SEGMENT_ID) body.segments = [{ id: env.RESEND_SEGMENT_ID }];
  const created = await doFetch(`${RESEND}/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!created.ok) return { status: 'error' };

  if (env.WAITLIST_FROM_EMAIL) {
    // Best effort: the signup already counts even if this email fails.
    try {
      await doFetch(`${RESEND}/emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: env.WAITLIST_FROM_EMAIL,
          to: [email],
          subject: 'você está na lista do por quê',
          text: 'Oi! Você entrou na lista de espera do por quê. Avisamos assim que o app chegar à App Store.\n\nUma pergunta por dia, para quem nunca para de perguntar.',
        }),
      });
    } catch {
      /* ignore */
    }
  }
  return { status: 'subscribed' };
}
