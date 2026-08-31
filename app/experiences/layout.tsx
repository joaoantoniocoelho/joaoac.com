import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience | João Coelho',
  description: 'The teams, products, technical decisions, and lessons behind João Coelho’s software engineering career.',
  alternates: {
    canonical: '/experiences',
    languages: { 'en-US': '/experiences', 'pt-BR': '/pt-BR/experiences' },
  },
};

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
