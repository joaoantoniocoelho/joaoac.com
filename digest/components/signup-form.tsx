'use client';

import { useState, type FormEvent } from 'react';
import { acquisitionFields } from '../lib/acquisition';
import { apiBaseUrl } from '../lib/api';
import { copy, type Locale } from '../lib/copy';
import { readEntryAttribution } from '../lib/entry-attribution';
import { shouldRetryWithoutAttribution, subscribeBody, subscribeOutcome, type SubscribeBody, type SubscribeOutcome } from '../lib/subscribe';

type FormState = 'idle' | 'loading' | SubscribeOutcome;

type Props = {
  locale: Locale;
  // Pages can render more than one form, so each needs its own input id for the label.
  inputId: string;
  variant?: 'stacked' | 'inline';
};

async function postSubscribe(body: SubscribeBody): Promise<number> {
  const response = await fetch(`${apiBaseUrl}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.status;
}

export function SignupForm({ locale, inputId, variant = 'stacked' }: Props) {
  const t = copy[locale];
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const messageId = `${inputId}-message`;
  const loading = state === 'loading';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const normalized = email.trim();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setState('invalid');
      return;
    }
    setState('loading');
    if (!apiBaseUrl) { setState('unavailable'); return; }
    try {
      // Read at submit time (not with useSearchParams) so statically rendered pages stay static.
      const body = subscribeBody(normalized, acquisitionFields(window.location.href, readEntryAttribution()));
      const status = await postSubscribe(body);
      const finalStatus = shouldRetryWithoutAttribution(status, body) ? await postSubscribe({ email: normalized }) : status;
      setState(subscribeOutcome(finalStatus));
    } catch { setState('unavailable'); }
  }

  const message = state === 'success' ? t.subscribeSuccess : state === 'invalid' ? t.invalidEmail : state === 'rate' ? t.rateLimited : state === 'unavailable' ? t.unavailable : '';

  return <form className={variant === 'inline' ? 'signup-form-inline' : undefined} onSubmit={submit} noValidate>
    <label className="field-label" htmlFor={inputId}>{t.email}</label>
    <div className="signup-form-row">
      {/* readOnly instead of disabled keeps focus on the field while sending, so a keyboard user can fix an error in place. */}
      <input className="email-input" id={inputId} type="email" autoComplete="email" maxLength={254} placeholder={t.placeholder} value={email} onChange={event => { setEmail(event.target.value); if (!loading) setState('idle'); }} readOnly={loading} aria-invalid={state === 'invalid'} aria-describedby={messageId} required />
      <button className="button" type="submit" disabled={loading}>{loading ? t.subscribing : t.subscribe}</button>
    </div>
    <p className="message" id={messageId} data-kind={state === 'success' ? 'success' : 'error'} role="status" aria-live="polite">{message}</p>
  </form>;
}
