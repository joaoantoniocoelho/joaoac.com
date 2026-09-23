import type { Metadata } from 'next';
import { Unsubscribe } from '../../../components/unsubscribe';

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <Unsubscribe token={token} />;
}
