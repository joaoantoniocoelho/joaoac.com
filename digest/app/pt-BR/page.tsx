import type { Metadata } from 'next';
import { Landing } from '../../components/landing';
import { getLatestEdition } from '../../lib/editions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Tech Digest | João Coelho' },
  description: 'Leituras selecionadas sobre engenharia de software e tecnologia, em um e-mail direto ao ponto.',
  alternates: { canonical: '/pt-BR', languages: { en: '/', 'pt-BR': '/pt-BR', 'x-default': '/' } },
};

export default async function Page() {
  const latestEdition = await getLatestEdition();
  return <Landing locale="pt-BR" latestEdition={latestEdition} />;
}
