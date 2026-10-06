import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { copy, type Locale } from '../lib/copy';
import { archivePath, editionPath, formatEditionDate, isEditionDate, otherLocale } from '../lib/digest-routes';
import { getEdition, safeArticleUrl } from '../lib/editions';
import { DigestFooter } from './digest-footer';
import { DigestHeader } from './digest-header';
import { DocumentLocale } from './document-locale';
import { SignupForm } from './signup-form';

export async function editionMetadata(locale: Locale, date: string): Promise<Metadata> {
  if (!isEditionDate(date)) return {};
  const edition = await getEdition(date);
  if (!edition) return {};
  const t = copy[locale];
  const day = formatEditionDate(locale, date);
  const title = t.editionMetaTitle(day);
  const description = t.editionMetaDescription(edition.articles.length, day);
  const url = `https://digest.joaoac.com${editionPath(locale, date)}`;
  return {
    title,
    description,
    alternates: {
      canonical: editionPath(locale, date),
      languages: { en: editionPath('en', date), 'pt-BR': editionPath('pt-BR', date), 'x-default': editionPath('en', date) },
    },
    openGraph: {
      title, description, url, type: 'article',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      images: [{ url: 'https://www.joaoac.com/avatar.png', width: 1254, height: 1254, alt: 'João Coelho' }],
    },
    twitter: {
      title, description, card: 'summary',
      images: ['https://www.joaoac.com/avatar.png'],
    },
  };
}

export async function DigestEdition({ locale, date }: { locale: Locale; date: string }) {
  if (!isEditionDate(date)) notFound();
  const edition = await getEdition(date);
  if (!edition) notFound();
  const t = copy[locale];
  const day = formatEditionDate(locale, date);

  return <div className="shell public-digest-shell">
    <DocumentLocale locale={locale} />
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /></div>
    <DigestHeader locale={locale} alternatePath={editionPath(otherLocale(locale), date)} link={{ href: archivePath(locale), label: t.allEditions }} />
    <div className="container">
      <main className="public-digest-main">
        <p className="section-kicker">{t.editionKicker} · {day}</p>
        <h1>Tech Digest — {day}</h1>
        <p className="public-digest-lead">{t.editionLead(edition.articles.length)}</p>
        <section className="public-digest-cta" aria-label={t.editionSignupLabel}>
          <p>{t.editionCta}</p>
          <SignupForm locale={locale} inputId="edition-email-top" variant="inline" />
        </section>
        <ol className="public-article-list">
          {edition.articles.map((article, index) => {
            const url = safeArticleUrl(article.url);
            return <li key={`${article.url}-${index}`}>
              <span className="public-article-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="public-article-meta">{article.source}{article.topics.length ? ` · ${article.topics.join(' · ')}` : ''}</p>
                <h2>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{article.title} ↗</a> : article.title}</h2>
                {article.why_interesting && <p className="public-article-why">{article.why_interesting}</p>}
                {url && <a className="public-article-source" href={url} target="_blank" rel="noopener noreferrer">{t.readAt(article.source)} →</a>}
              </div>
            </li>;
          })}
        </ol>
        <section className="public-digest-bottom-cta" aria-labelledby="edition-signup-bottom-title">
          <h2 id="edition-signup-bottom-title">{t.editionBottomTitle}</h2>
          <p>{t.editionBottomText}</p>
          <SignupForm locale={locale} inputId="edition-email-bottom" variant="inline" />
          <p className="fine-print">{t.privacy}</p>
        </section>
        <nav className="public-digest-pagination" aria-label={t.editionNavigation}>
          {edition.older_date ? <Link href={editionPath(locale, edition.older_date)} rel="prev">← {t.previousEdition}</Link> : <span />}
          <Link href={archivePath(locale)}>{t.fullArchive}</Link>
          {edition.newer_date ? <Link href={editionPath(locale, edition.newer_date)} rel="next">{t.followingEdition} →</Link> : <span />}
        </nav>
      </main>
      <DigestFooter locale={locale} />
    </div>
  </div>;
}
