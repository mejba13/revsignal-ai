'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === 'loading' || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030014]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 opacity-20 blur-sm" />
          </div>
          <p className="text-sm text-white/40">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014]">
      {/* Cosmic Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_0%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_0%_100%,rgba(236,72,153,0.06),transparent)]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating orbs - subtle for dashboard */}
        <div className="orb orb-violet float-slow absolute -left-32 -top-32 h-96 w-96 opacity-30" />
        <div className="orb orb-cyan float absolute -right-24 top-1/3 h-72 w-72 opacity-20" />
        <div className="orb orb-pink float-reverse absolute bottom-0 left-1/4 h-64 w-64 opacity-15" />

        {/* Noise texture */}
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader
            user={{
              id: session.user?.id || '',
              name: session.user?.name,
              email: session.user?.email,
              organizationId: (session.user as any)?.organizationId || '',
              role: (session.user as any)?.role || 'MEMBER',
            }}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
