import type { Metadata } from 'next';
import { Landing } from '../../components/landing';

export const metadata: Metadata = {
  title: { absolute: 'Tech Digest | João Coelho' },
  description: 'Leituras selecionadas sobre engenharia de software e tecnologia, em um e-mail direto ao ponto.',
  alternates: { canonical: '/pt-BR', languages: { en: '/', 'pt-BR': '/pt-BR', 'x-default': '/' } },
};

export default function Page() { return <Landing locale="pt-BR" />; }
