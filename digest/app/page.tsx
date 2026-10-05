import type { Metadata } from 'next';
import { Landing } from '../components/landing';
import { getLatestEdition } from '../lib/editions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { en: '/', 'pt-BR': '/pt-BR', 'x-default': '/' } },
};

export default async function Page() {
  const latestEdition = await getLatestEdition();
  return <Landing locale="en" latestEdition={latestEdition} />;
}
