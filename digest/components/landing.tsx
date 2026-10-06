'use client';

import { useEffect } from 'react';
import { copy, type Locale } from '../lib/copy';
import { archivePath, editionPath } from '../lib/digest-routes';
import { DigestHeader } from './digest-header';
import { FocusTitle } from './focus-title';
import { DigestFooter } from './digest-footer';
import { LandingDetails } from './landing-details';
import { NextEditionCountdown } from './next-edition-countdown';
import { SignupForm } from './signup-form';
import type { PublicEdition } from '../lib/editions';

export function Landing({ locale, latestEdition }: { locale: Locale; latestEdition: PublicEdition | null }) {
  const t = copy[locale];
  useEffect(() => { document.documentElement.lang = locale; localStorage.setItem('digest-locale', locale); }, [locale]);

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
          {latestEdition && <div className="latest-edition-links"><a href={editionPath(locale, latestEdition.date)}>{t.readLatestEdition} →</a><a href={archivePath(locale)}>{t.browseArchive} →</a></div>}
        </div>
        <div className="signup-card hero-reveal-card" id="subscribe">
          <div className="card-top"><span className="card-label">TECH DIGEST / 001</span><span className="signal" aria-hidden="true"><span/><span/><span/></span></div>
          <NextEditionCountdown locale={locale} />
          <h2>{t.cardTitle}</h2>
          <p className="card-description">{t.cardDescription}</p>
          <SignupForm locale={locale} inputId="digest-email" />
          <p className="fine-print">{t.privacy}</p>
        </div>
      </section>
      <LandingDetails locale={locale} latestEdition={latestEdition} />
      </main>
      <DigestFooter locale={locale} />
    </div>
  </div>;
}
