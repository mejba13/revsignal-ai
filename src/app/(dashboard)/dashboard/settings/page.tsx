import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import { authOptions } from '@/lib/auth';
import { SettingsContent } from './settings-content';

export const metadata: Metadata = {
  title: 'Settings | RevSignal AI',
  description: 'Manage your account settings, notifications, security, and billing preferences',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <SettingsContent userName={session.user?.name || 'User'} userEmail={session.user?.email || ''} />;
}
