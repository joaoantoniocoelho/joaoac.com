'use client';

import { useEffect, useState } from 'react';
import { apiBaseUrl, unsubscribePath, validToken } from '../lib/api';
import { copy, type Locale } from '../lib/copy';
import { DigestHeader } from './digest-header';

type State = 'confirm' | 'loading' | 'success' | 'invalid' | 'unavailable';

export function Unsubscribe({ token }: { token: string }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [state, setState] = useState<State>(validToken.test(token) ? 'confirm' : 'invalid');
  const t = copy[locale];

  useEffect(() => {
    const saved = localStorage.getItem('digest-locale');
    const next: Locale = saved === 'en' || saved === 'pt-BR' ? saved : navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
    setLocale(next);
    document.documentElement.lang = next;
  }, []);

  function changeLocale(next: Locale) {
    setLocale(next);
    document.documentElement.lang = next;
    localStorage.setItem('digest-locale', next);
  }

  async function confirm() {
    if (state !== 'confirm') return;
    if (!validToken.test(token)) { setState('invalid'); return; }
    if (!apiBaseUrl) { setState('unavailable'); return; }
    setState('loading');
    try {
      const response = await fetch(unsubscribePath(token), { method: 'POST' });
      if (response.status === 200) setState('success');
      else if (response.status === 404) setState('invalid');
      else setState('unavailable');
    } catch { setState('unavailable'); }
  }

  return <div className="shell">
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /><span className="ambient-secondary" /></div>
    <DigestHeader locale={locale} onLocaleChange={changeLocale} />
    <div className="container">
      <main className="status-wrap">
        <section className="status-card" aria-live="polite">
          <div className="eyebrow">Tech Digest</div>
          <h1>{state === 'success' ? t.unsubscribeSuccess : state === 'invalid' ? t.invalidToken : state === 'unavailable' ? t.unavailable : t.unsubscribeTitle}</h1>
          {(state === 'confirm' || state === 'loading') && <><p>{t.unsubscribeDetail}</p><button className="button" type="button" onClick={confirm} disabled={state === 'loading'}>{state === 'loading' ? t.confirming : t.confirm}</button></>}
          {state === 'unavailable' && <button className="button" type="button" onClick={() => setState('confirm')}>{locale === 'en' ? 'Try again' : 'Tentar novamente'}</button>}
          <a className="small-link" href={locale === 'en' ? '/' : '/pt-BR'}>← {t.back}</a>
        </section>
      </main>
      <footer className="footer"><span>© {new Date().getFullYear()} Tech Digest</span><span>{t.from}</span></footer>
    </div>
  </div>;
}
