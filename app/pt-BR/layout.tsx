import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'João Coelho | Engenheiro de Software Sênior - Backend, Cloud e IA',
    template: '%s | João Coelho',
  },
  description:
    'Engenheiro de software sênior na ADP escrevendo sobre sistemas backend, infraestrutura em nuvem e ferramentas de desenvolvimento com IA. Antes, SAP e fintech.',
  alternates: {
    canonical: '/pt-BR',
    languages: { 'en-US': '/', 'pt-BR': '/pt-BR', 'x-default': '/' },
  },
  openGraph: {
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: `${SITE_URL}/pt-BR`,
    title: 'João Coelho | Engenheiro de Software Sênior',
    description: 'Sistemas backend, infraestrutura em nuvem e ferramentas de desenvolvimento com IA.',
  },
};

export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
