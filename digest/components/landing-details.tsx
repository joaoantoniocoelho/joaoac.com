'use client';

import type { MouseEvent } from 'react';
import { FiFilter, FiRss, FiSend } from 'react-icons/fi';
import { copy, type Locale } from '../lib/copy';
import { safeArticleUrl, type PublicEdition } from '../lib/editions';

const stepIcons = [FiRss, FiFilter, FiSend];

const sampleArticles = [
  {
    title: 'Formal methods with Hillel Wayne',
    url: 'https://newsletter.pragmaticengineer.com/p/formal-methods-with-hillel-wayne',
  },
  {
    title: 'The last six months in LLMs, in five minutes',
    url: 'https://simonw.substack.com/p/the-last-six-months-in-llms-in-five',
  },
  {
    title: 'What changed in SQLite this year',
    url: 'https://sqlite.org/changes.html',
  },
] as const;

function backToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

export function LandingDetails({ locale, latestEdition }: { locale: Locale; latestEdition: PublicEdition | null }) {
  const t = copy[locale];
  const latestDate = latestEdition && new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${latestEdition.date}T12:00:00Z`));

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
          <p>{latestEdition ? t.latestIntro : t.sampleIntro}</p>
        </div>
        <div className="sample-aside">
          <span className="sample-aside-mark" aria-hidden="true">“</span>
          <h3>{t.sampleAsideTitle}</h3>
          <p>{t.sampleAsideDescription}</p>
        </div>
      </div>
      <div className="sample-edition">
        <div className="sample-edition-header">
          <span className="sample-brand">TECH DIGEST</span>
          <span className="sample-edition-stamp">{latestEdition ? latestEdition.date : t.sampleStamp}</span>
        </div>
        <span className="sample-rule" aria-hidden="true" />
        <div className="sample-edition-intro">
          <h3>{t.sampleEditionTitle}</h3>
          <p>{latestDate || t.sampleEditionDate}</p>
          <p>{latestEdition ? `${latestEdition.articles.length} ${t.selectedArticles}` : t.sampleEditionCount}</p>
        </div>
        <ol>
          {latestEdition ? latestEdition.articles.slice(0, 3).map(article => <li key={article.url}>
            <h4>{safeArticleUrl(article.url) ? <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}<span aria-hidden="true">&gt;</span></a> : article.title}</h4>
            <p>{article.source}{article.topics.length ? ` · ${article.topics.join(' · ')}` : ''}</p>
            {article.why_interesting && <p className="sample-story-note">{article.why_interesting}</p>}
          </li>) : sampleArticles.map((article, index) => <li key={article.url}>
            <h4><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}<span aria-hidden="true">&gt;</span></a></h4>
            <p>{t.sampleArticleMeta[index]}</p>
            {index === 0 && <p className="sample-story-note">{t.sampleLeadTopic}</p>}
          </li>)}
        </ol>
        {latestEdition && <div className="sample-edition-actions"><a href={`/digest/${latestEdition.date}`}>{t.readFullEdition} →</a><a href="/digest">{t.browseArchive} →</a></div>}
        <div className="sample-edition-footer">
          <p>{t.sampleCurated}</p>
          <div>
            <a href="https://joaoac.com" target="_blank" rel="noopener noreferrer">{t.sampleWebsite}</a>
            <span aria-hidden="true">·</span>
            <a href="https://x.com/joaoac_" target="_blank" rel="noopener noreferrer">X</a>
            <span aria-hidden="true">·</span>
            <span className="sample-unsubscribe">{t.sampleUnsubscribe}</span>
          </div>
        </div>
      </div>
    </section>

    <section className="details-section process-section" aria-labelledby="process-heading">
      <div className="section-heading">
        <p className="section-kicker">03 / {t.processLabel}</p>
        <h2 id="process-heading">{t.processTitle}<span className="accent-period">.</span></h2>
        <p>{t.processIntro}</p>
      </div>
      <ol className="process-steps">
        {t.steps.map((step, index) => {
          const Icon = stepIcons[index];
          return <li key={step.title}>
            <span className="step-number">0{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.description}</p></div>
            <Icon className="step-arrow" aria-hidden="true" />
          </li>;
        })}
      </ol>
    </section>

    <section className="final-cta" aria-labelledby="final-heading">
      <div className="final-copy">
        <p className="section-kicker">04 / {t.finalLabel}</p>
        <h2 id="final-heading">{t.finalTitle}</h2>
        <p>{t.finalDescription}</p>
      </div>
      <a href="#page-top" onClick={backToTop}>{t.finalAction}</a>
    </section>
  </>;
}
