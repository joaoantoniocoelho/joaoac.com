import type { Metadata } from 'next';
import { DigestEdition, editionMetadata } from '../../../../components/digest-edition';

export const revalidate = 3600;

export function generateStaticParams(): { date: string }[] {
  return [];
}

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return editionMetadata('pt-BR', date);
}

export default async function EditionPage({ params }: Props) {
  const { date } = await params;
  return <DigestEdition locale="pt-BR" date={date} />;
}
