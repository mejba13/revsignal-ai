import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import { authOptions } from '@/lib/auth';
import { ForecastsContent } from './forecasts-content';

export const metadata: Metadata = {
  title: 'Revenue Forecasts | RevSignal AI',
  description: 'AI-powered revenue forecasting with commit, best case, and pipeline projections for accurate sales predictions',
};

export default async function ForecastsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <ForecastsContent />;
}
