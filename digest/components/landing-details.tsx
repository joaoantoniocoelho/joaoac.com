'use client';

import type { MouseEvent } from 'react';
import { copy, type Locale } from '../lib/copy';

const sampleArticles = [
  {
    source: 'The Pragmatic Engineer',
    title: 'Formal methods with Hillel Wayne',
    url: 'https://newsletter.pragmaticengineer.com/p/formal-methods-with-hillel-wayne',
  },
  {
    source: "Simon Willison's Newsletter",
    title: 'The last six months in LLMs in five minutes',
    url: 'https://simonw.substack.com/p/the-last-six-months-in-llms-in-five',
  },
] as const;

function backToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

export function LandingDetails({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return <>
    <section className="details-section pain-section" aria-labelledby="pain-heading">
      <div className="section-heading">
        <p className="section-kicker">01 / {t.painLabel}</p>
        <h2 id="pain-heading">{t.painTitle}<span className="accent-period">.</span></h2>
        <p>{t.painIntro}</p>
      </div>
      <div className="pain-grid">
        {t.painItems.map(item => <article className="pain-card" key={item.number}>
          <span className="pain-index">{item.number} /</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>)}
      </div>
      <div className="answer-panel">
        <span className="answer-symbol" aria-hidden="true">↳</span>
        <div>
          <h3>{t.answerTitle}</h3>
          <p>{t.answerDescription}</p>
        </div>
        <span className="answer-mark" aria-hidden="true">TD</span>
      </div>
    </section>

    <section className="details-section sample-section" aria-labelledby="sample-heading">
      <div className="sample-intro">
        <div className="section-heading">
          <p className="section-kicker">02 / {t.sampleLabel}</p>
          <h2 id="sample-heading">{t.sampleTitle}<span className="accent-period">.</span></h2>
          <p>{t.sampleIntro}</p>
        </div>
        <div className="sample-aside">
          <span className="sample-aside-mark" aria-hidden="true">“</span>
          <h3>{t.sampleAsideTitle}</h3>
          <p>{t.sampleAsideDescription}</p>
        </div>
      </div>
      <div className="sample-edition">
        <div className="sample-edition-header">
          <span className="sample-brand">Tech Digest<span className="accent-period">.</span></span>
          <span className="sample-edition-label">{t.preview}</span>
        </div>
        <ol>
          {sampleArticles.map((article, index) => <li key={article.url}>
            <p className="sample-source">{String(index + 1).padStart(2, '0')} / {article.source}</p>
            <h3>{article.title}</h3>
            <p className="sample-why"><span>{t.sampleWhy}:</span> {t.sampleReasons[index]}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.sampleRead}: ${article.title}`}>{t.sampleRead} <span aria-hidden="true">↗</span></a>
          </li>)}
        </ol>
        <div className="sample-edition-bottom"><span>TECH DIGEST</span><span>01—08</span></div>
      </div>
    </section>

    <section className="details-section process-section" aria-labelledby="process-heading">
      <div className="section-heading">
        <p className="section-kicker">03 / {t.processLabel}</p>
        <h2 id="process-heading">{t.processTitle}<span className="accent-period">.</span></h2>
        <p>{t.processIntro}</p>
      </div>
      <ol className="process-steps">
        {t.steps.map((step, index) => <li key={step.title}>
          <span className="step-number">0{index + 1}</span>
          <div><h3>{step.title}</h3><p>{step.description}</p></div>
          <span className="step-arrow" aria-hidden="true">↗</span>
        </li>)}
      </ol>
    </section>

    <section className="final-cta" aria-labelledby="final-heading">
      <div className="final-copy">
        <p className="section-kicker">04 / {t.finalLabel}</p>
        <h2 id="final-heading">{t.finalTitle}</h2>
        <p>{t.finalDescription}</p>
      </div>
      <a href="#page-top" onClick={backToTop}>{t.finalAction}<span aria-hidden="true">↑</span></a>
    </section>
  </>;
}
