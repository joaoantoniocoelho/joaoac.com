import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'João Coelho | Engenheiro de Software e Experiências Digitais',
  description: 'Engenheiro de software construindo sistemas backend, produtos em nuvem, experimentos com IA e landing pages refinadas.',
  alternates: {
    canonical: '/pt-BR',
    languages: { 'en-US': '/', 'pt-BR': '/pt-BR' },
  },
  openGraph: {
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: 'https://joaoac.com/pt-BR',
    title: 'João Coelho | Engenheiro de Software e Experiências Digitais',
    description: 'Sistemas backend, produtos em nuvem, experimentos com IA e landing pages refinadas.',
  },
};

export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
