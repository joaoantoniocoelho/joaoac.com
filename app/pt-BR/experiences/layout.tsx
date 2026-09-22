import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'pt-BR',
  path: '/experiences',
  title: 'Experiência',
  description: 'As equipes, os produtos, as decisões técnicas e as lições da carreira de João Coelho em engenharia de software.',
});

export default function ExperiencesPtBrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
