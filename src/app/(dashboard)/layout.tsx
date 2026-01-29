import { requireAuth } from '@/lib/auth-utils';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader user={user} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
