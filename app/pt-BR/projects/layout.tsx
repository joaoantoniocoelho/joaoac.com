import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'pt-BR',
  path: '/projects',
  title: 'Projetos',
  description: 'Produtos que João Coelho levou da ideia à produção, de ponta a ponta.',
});

export default function ProjectsPtBrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
