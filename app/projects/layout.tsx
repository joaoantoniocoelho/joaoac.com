import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Products João Coelho built end to end, from idea to production.',
  alternates: {
    canonical: '/projects',
    languages: { 'en-US': '/projects', 'pt-BR': '/pt-BR/projects', 'x-default': '/projects' },
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
