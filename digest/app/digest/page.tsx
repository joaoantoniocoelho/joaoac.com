import type { Metadata } from 'next';
import Link from 'next/link';
import { DigestFooter } from '../../components/digest-footer';
import { getEditions } from '../../lib/editions';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Edition archive',
  description: 'Browse past daily Tech Digest editions and read the original software engineering articles.',
  alternates: { canonical: '/digest' },
};

export default async function ArchivePage() {
  const editions = await getEditions();
  return <div className="shell public-digest-shell">
    <div className="ambient-screen" aria-hidden="true"><span className="ambient-primary" /></div>
    <div className="container">
      <header className="public-digest-header"><Link className="brand" href="/"><span className="brand-mark">TD</span><span className="brand-name">Tech Digest</span></Link><Link href="/#subscribe">Subscribe →</Link></header>
      <main className="public-digest-main">
        <p className="section-kicker">The archive</p>
        <h1>Every edition, one place.</h1>
        <p className="public-digest-lead">A daily shortlist of software engineering articles worth opening.</p>
        <ul className="public-archive-list">
          {editions.map(edition => <li key={edition.date}><Link href={`/digest/${edition.date}`}><span>{new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${edition.date}T12:00:00Z`))}</span><span>{edition.article_count} articles ↗</span></Link></li>)}
        </ul>
        {editions.length === 0 && <p>No editions have been published yet.</p>}
      </main>
      <DigestFooter locale="en" />
    </div>
  </div>;
}
