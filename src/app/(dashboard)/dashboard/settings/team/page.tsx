import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import { authOptions } from '@/lib/auth';
import { TeamContent } from './team-content';

export const metadata: Metadata = {
  title: 'Team Management | RevSignal AI',
  description: 'Manage your team members, roles, and permissions for RevSignal AI',
};

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <TeamContent />;
}
