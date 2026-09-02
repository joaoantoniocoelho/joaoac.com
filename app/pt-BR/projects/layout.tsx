import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Produtos que João Coelho levou da ideia à produção, de ponta a ponta.',
  alternates: {
    canonical: '/pt-BR/projects',
    languages: { 'en-US': '/projects', 'pt-BR': '/pt-BR/projects', 'x-default': '/projects' },
  },
};

export default function ProjectsPtBrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
