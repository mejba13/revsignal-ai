import { getCurrentUser } from '@/lib/auth-utils';
import { DashboardContent } from './dashboard-content';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return <DashboardContent userName={user?.name?.split(' ')[0] || 'User'} />;
}
