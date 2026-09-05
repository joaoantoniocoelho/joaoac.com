import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'João Coelho | Software, sistemas e produtos',
    template: '%s | João Coelho',
  },
  description:
    'Engenheiro de software na ADP, antes SAP e Bazk. Construo sistemas backend, ferramentas de IA e meus próprios produtos, e escrevo sobre o que aprendo.',
  alternates: {
    canonical: '/pt-BR',
    languages: { 'en-US': '/', 'pt-BR': '/pt-BR', 'x-default': '/' },
  },
  openGraph: {
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: `${SITE_URL}/pt-BR`,
    title: 'João Coelho | Software, sistemas e produtos',
    description: 'Construindo sistemas backend, ferramentas de IA e meus próprios produtos. Hoje na ADP; antes, SAP e Bazk.',
  },
};

export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
