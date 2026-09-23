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

export function LandingDetails({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return <>
    <section className="details-section process-section" aria-labelledby="process-heading">
      <div className="section-heading">
        <p className="section-kicker">01 / {t.processLabel}</p>
        <h2 id="process-heading">{t.processTitle}<span className="accent-period">.</span></h2>
        <p>{t.processIntro}</p>
      </div>
      <ol className="process-steps">
        {t.steps.map((step, index) => <li key={step.title}>
          <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>)}
      </ol>
      <figure className="pipeline">
        <figcaption className="pipeline-label">{t.pipelineLabel}</figcaption>
        <ol className="pipeline-flow">
          {t.pipeline.map((stage, index) => <li key={stage} className={index === t.pipeline.length - 1 ? 'last-stage' : ''}>{stage}</li>)}
        </ol>
      </figure>
    </section>

    <section className="details-section engineering-section" aria-labelledby="engineering-heading">
      <div className="section-heading">
        <p className="section-kicker">02 / {t.engineeringLabel}</p>
        <h2 id="engineering-heading">{t.engineeringTitle}<span className="accent-period">.</span></h2>
        <p>{t.engineeringIntro}</p>
      </div>
      <div className="engineering-points">
        {t.engineering.map(point => <div key={point.title}>
          <h3>{point.title}</h3>
          <p>{point.description}</p>
        </div>)}
      </div>
    </section>

    <section className="details-section sample-section" aria-labelledby="sample-heading">
      <div className="section-heading">
        <p className="section-kicker">03 / {t.sampleLabel}</p>
        <h2 id="sample-heading">{t.sampleTitle}<span className="accent-period">.</span></h2>
        <p>{t.sampleIntro}</p>
      </div>
      <div className="sample-edition">
        <p className="sample-edition-label">Tech Digest <span>/ {locale === 'en' ? 'preview' : 'prévia'}</span></p>
        <ol>
          {sampleArticles.map((article, index) => <li key={article.url}>
            <p className="sample-source">{String(index + 1).padStart(2, '0')} / {article.source}</p>
            <h3>{article.title}</h3>
            <p className="sample-why"><span>{t.sampleWhy}:</span> {t.sampleReasons[index]}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.sampleRead}: ${article.title}`}>{t.sampleRead} <span aria-hidden="true">↗</span></a>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="final-cta" aria-labelledby="final-heading">
      <div>
        <h2 id="final-heading">{t.finalTitle}</h2>
        <p>{t.finalDescription}</p>
      </div>
      <a href="#subscribe">{t.finalAction}<span aria-hidden="true">↑</span></a>
    </section>
  </>;
}
