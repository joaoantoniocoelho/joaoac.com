export const EDITIONS_TAG = 'digest-editions';

export function editionTag(date: string): string {
  return `digest-edition-${date}`;
}

export type RevalidatePayload = { date: string; previousDate: string | null };

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function parseRevalidatePayload(value: unknown): RevalidatePayload | null {
  if (typeof value !== 'object' || value === null || !('date' in value)) return null;
  if (!isCalendarDate(value.date)) return null;
  const previousDate = 'previousDate' in value ? value.previousDate : null;
  if (previousDate !== null && !isCalendarDate(previousDate)) return null;
  return { date: value.date, previousDate };
}

// The previous edition links forward to the new one through its newer_date, so it is purged too.
export function tagsToPurge({ date, previousDate }: RevalidatePayload): string[] {
  return [EDITIONS_TAG, editionTag(date), ...(previousDate ? [editionTag(previousDate)] : [])];
}

export function bearerToken(authorization: string | null): string {
  return authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : '';
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
}

// Hashing first gives both sides the same length, so the comparison time does not leak the token length.
export async function tokenMatches(provided: string, expected: string): Promise<boolean> {
  if (!provided || !expected) return false;
  const [a, b] = await Promise.all([sha256(provided), sha256(expected)]);
  let difference = 0;
  a.forEach((byte, index) => {
    difference |= byte ^ (b[index] ?? 0);
  });
  return difference === 0;
}
