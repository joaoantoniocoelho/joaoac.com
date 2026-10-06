import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { copy, type Locale } from '../lib/copy';
import { archivePath, editionPath, formatEditionDate, otherLocale, parsePage, subscribePath, type SearchParams } from '../lib/digest-routes';
import { getEditionPage } from '../lib/editions';
import { DigestFooter } from './digest-footer';
import { DigestHeader } from './digest-header';
import { DocumentLocale } from './document-locale';

export function archiveMetadata(locale: Locale, searchParams: SearchParams): Metadata {
  const t = copy[locale];
  const page = parsePage(searchParams.page) ?? 1;
  return {
    title: page > 1 ? `${t.archiveMetaTitle} · ${t.archivePageLabel(page)}` : t.archiveMetaTitle,
    description: t.archiveMetaDescription,
    alternates: {
      canonical: archivePath(locale, page),
      languages: { en: archivePath('en', page), 'pt-BR': archivePath('pt-BR', page), 'x-default': archivePath('en', page) },
    },
  };
}

export async function DigestArchive({ locale, searchParams }: { locale: Locale; searchParams: SearchParams }) {
  const t = copy[locale];
  const page = parsePage(searchParams.page);
  if (page === null) redirect(archivePath(locale));
  const { editions, has_more: hasMore } = await getEditionPage(page);
  if (page > 1 && editions.length === 0) notFound();

  return <div className="shell public-digest-shell">
    <DocumentLocale locale={locale} />
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /></div>
    <DigestHeader locale={locale} alternatePath={archivePath(otherLocale(locale), page)} link={{ href: subscribePath(locale), label: t.subscribeLink }} />
    <div className="container">
      <main className="public-digest-main">
        <p className="section-kicker">{t.archiveKicker}{page > 1 && ` · ${t.archivePageLabel(page)}`}</p>
        <h1>{t.archiveTitle}</h1>
        <p className="public-digest-lead">{t.archiveLead}</p>
        <ul className="public-archive-list">
          {editions.map(edition => <li key={edition.date}><Link href={editionPath(locale, edition.date)}><span>{formatEditionDate(locale, edition.date)}</span><span>{t.articleCount(edition.article_count)} ↗</span></Link></li>)}
        </ul>
        {editions.length === 0 && <p>{t.archiveEmpty}</p>}
        {(page > 1 || hasMore) && <nav className="public-digest-pagination" aria-label={t.archiveNavigation}>
          {page > 1 ? <Link href={archivePath(locale, page - 1)} rel="prev">← {t.newerEditions}</Link> : <span />}
          <span>{t.archivePageLabel(page)}</span>
          {hasMore ? <Link href={archivePath(locale, page + 1)} rel="next">{t.olderEditions} →</Link> : <span />}
        </nav>}
      </main>
      <DigestFooter locale={locale} />
    </div>
  </div>;
}
