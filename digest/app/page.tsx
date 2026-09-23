import type { Metadata } from 'next';
import { Landing } from '../components/landing';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { en: '/', 'pt-BR': '/pt-BR', 'x-default': '/' } },
};

export default function Page() { return <Landing locale="en" />; }
