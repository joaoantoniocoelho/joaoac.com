'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { apiBaseUrl } from '../lib/api';
import { copy, type Locale } from '../lib/copy';
import { DigestHeader } from './digest-header';
import { FocusTitle } from './focus-title';
import { DigestFooter } from './digest-footer';
import { LandingDetails } from './landing-details';
import { NextEditionCountdown } from './next-edition-countdown';

type FormState = 'idle' | 'loading' | 'success' | 'invalid' | 'rate' | 'unavailable';

export function Landing({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  useEffect(() => { document.documentElement.lang = locale; localStorage.setItem('digest-locale', locale); }, [locale]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'loading') return;
    const normalized = email.trim();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setState('invalid');
      return;
    }
    setState('loading');
    if (!apiBaseUrl) { setState('unavailable'); return; }
    try {
      const response = await fetch(`${apiBaseUrl}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
      if (response.status === 200) setState('success');
      else if (response.status === 400 || response.status === 413) setState('invalid');
      else if (response.status === 429) setState('rate');
      else setState('unavailable');
    } catch { setState('unavailable'); }
  }

  const message = state === 'success' ? t.subscribeSuccess : state === 'invalid' ? t.invalidEmail : state === 'rate' ? t.rateLimited : state === 'unavailable' ? t.unavailable : '';

  return <div className="shell">
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /><span className="ambient-secondary" /></div>
    <DigestHeader locale={locale} />
    <div className="container" id="page-top">
      <main>
      <section className="hero">
        <span className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow hero-reveal">{t.eyebrow}</div>
          <FocusTitle text={t.title} />
          <p className="lead">{t.intro}</p>
          <p className="detail">{t.detail}</p>
          <p className="hero-note">{t.heroNote}</p>
        </div>
        <div className="signup-card hero-reveal-card" id="subscribe">
          <div className="card-top"><span className="card-label">TECH DIGEST / 001</span><span className="signal" aria-hidden="true"><span/><span/><span/></span></div>
          <NextEditionCountdown locale={locale} />
          <h2>{t.cardTitle}</h2>
          <p className="card-description">{t.cardDescription}</p>
          <form onSubmit={submit} noValidate>
            <label className="field-label" htmlFor="digest-email">{t.email}</label>
            <input className="email-input" id="digest-email" type="email" autoComplete="email" maxLength={254} placeholder={t.placeholder} value={email} onChange={event => { setEmail(event.target.value); if (state !== 'loading') setState('idle'); }} disabled={state === 'loading'} required />
            <button className="button" type="submit" disabled={state === 'loading'}>{state === 'loading' ? t.subscribing : t.subscribe}</button>
            <p className="message" data-kind={state === 'success' ? 'success' : 'error'} role="status" aria-live="polite">{message}</p>
          </form>
          <p className="fine-print">{t.privacy}</p>
        </div>
      </section>
      <LandingDetails locale={locale} />
      </main>
      <DigestFooter locale={locale} />
    </div>
  </div>;
}
