import { Metadata } from 'next';
import { DealDetailContent } from './deal-detail-content';

export const metadata: Metadata = {
  title: 'Deal Details',
};

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DealDetailContent dealId={id} />;
}
