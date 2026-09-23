import type { Metadata } from 'next';
import { Unsubscribe } from '../../components/unsubscribe';

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } };

export default function Page() { return <Unsubscribe token="" />; }
