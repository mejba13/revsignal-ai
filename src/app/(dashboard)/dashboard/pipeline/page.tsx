import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import { authOptions } from '@/lib/auth';
import { PipelineContent } from './pipeline-content';

export const metadata: Metadata = {
  title: 'Pipeline | RevSignal AI',
  description: 'Visualize your sales pipeline with AI-powered insights and deal flow analysis',
};

export default async function PipelinePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <PipelineContent />;
}
