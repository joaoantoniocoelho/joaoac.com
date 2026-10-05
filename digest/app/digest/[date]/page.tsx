import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DigestFooter } from '../../../components/digest-footer';
import { getEdition, getEditions, safeArticleUrl } from '../../../lib/editions';

export const revalidate = 3600;

export function generateStaticParams(): { date: string }[] {
  return [];
}

type Props = { params: Promise<{ date: string }> };

function displayDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return {};
  const edition = await getEdition(date);
  if (!edition) return {};
  const title = `${displayDate(date)} edition`;
  const description = `${edition.articles.length} software engineering articles selected by Tech Digest on ${displayDate(date)}.`;
  const url = `https://digest.joaoac.com/digest/${date}`;
  return {
    title,
    description,
    alternates: { canonical: `/digest/${date}` },
    openGraph: {
      title, description, url, type: 'article',
      images: [{ url: 'https://www.joaoac.com/avatar.png', width: 1254, height: 1254, alt: 'João Coelho' }],
    },
    twitter: {
      title, description, card: 'summary',
      images: ['https://www.joaoac.com/avatar.png'],
    },
  };
}

export default async function EditionPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const [edition, editions] = await Promise.all([getEdition(date), getEditions()]);
  if (!edition) notFound();
  const position = editions.findIndex(item => item.date === date);
  const newer = position > 0 ? editions[position - 1] : null;
  const older = position >= 0 ? editions[position + 1] : null;
  const day = displayDate(date);

  return <div className="shell public-digest-shell">
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /></div>
    <div className="container">
      <header className="public-digest-header">
        <Link className="brand" href="/"><span className="brand-mark">TD</span><span className="brand-name">Tech Digest</span></Link>
        <Link href="/digest">All editions →</Link>
      </header>
      <main className="public-digest-main">
        <p className="section-kicker">Daily edition · {day}</p>
        <h1>Tech Digest — {day}</h1>
        <p className="public-digest-lead">{edition.articles.length} software engineering articles worth reading. Each link leads to the original source.</p>
        <div className="public-digest-cta"><span>Get the next selection in your inbox.</span><Link href="/#subscribe">Subscribe →</Link></div>
        <ol className="public-article-list">
          {edition.articles.map((article, index) => {
            const url = safeArticleUrl(article.url);
            return <li key={`${article.url}-${index}`}>
              <span className="public-article-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="public-article-meta">{article.source}{article.topics.length ? ` · ${article.topics.join(' · ')}` : ''}</p>
                <h2>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{article.title} ↗</a> : article.title}</h2>
                {article.why_interesting && <p className="public-article-why">{article.why_interesting}</p>}
                {url && <a className="public-article-source" href={url} target="_blank" rel="noopener noreferrer">Read at {article.source} →</a>}
              </div>
            </li>;
          })}
        </ol>
        <div className="public-digest-bottom-cta"><h2>Keep the signal. Skip the noise.</h2><p>A short selection of worthwhile engineering articles, delivered daily.</p><Link href="/#subscribe">Subscribe to Tech Digest →</Link></div>
        <nav className="public-digest-pagination" aria-label="Edition navigation">
          {older ? <Link href={`/digest/${older.date}`}>← Previous edition</Link> : <span />}
          <Link href="/digest">Full archive</Link>
          {newer ? <Link href={`/digest/${newer.date}`}>Next edition →</Link> : <span />}
        </nav>
      </main>
      <DigestFooter locale="en" />
    </div>
  </div>;
}
