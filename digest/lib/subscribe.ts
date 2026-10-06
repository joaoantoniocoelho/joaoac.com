import type { AcquisitionFields } from './acquisition';

export type SubscribeOutcome = 'success' | 'invalid' | 'rate' | 'unavailable';

export type SubscribeBody = AcquisitionFields & { email: string };

export function subscribeBody(email: string, attribution: AcquisitionFields): SubscribeBody {
  return { ...attribution, email };
}

// 413 says nothing about the email itself, so it must not tell the reader to fix a valid address.
export function subscribeOutcome(status: number): SubscribeOutcome {
  if (status === 200) return 'success';
  if (status === 400) return 'invalid';
  if (status === 429) return 'rate';
  return 'unavailable';
}

// Attribution is best effort; when it is what made the body too large, the signup is retried without it.
export function shouldRetryWithoutAttribution(status: number, body: SubscribeBody): boolean {
  return status === 413 && Object.keys(body).some(key => key !== 'email');
}
