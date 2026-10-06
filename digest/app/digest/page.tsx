import type { Metadata } from 'next';
import { DigestArchive, archiveMetadata } from '../../components/digest-archive';
import type { SearchParams } from '../../lib/digest-routes';

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return archiveMetadata('en', await searchParams);
}

export default async function ArchivePage({ searchParams }: Props) {
  return <DigestArchive locale="en" searchParams={await searchParams} />;
}
