import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiência',
  description: 'As equipes, os produtos, as decisões técnicas e as lições da carreira de João Coelho em engenharia de software.',
  alternates: {
    canonical: '/pt-BR/experiences',
    languages: { 'en-US': '/experiences', 'pt-BR': '/pt-BR/experiences', 'x-default': '/experiences' },
  },
};

export default function ExperiencesPtBrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
