'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  TrendingUp,
  Settings,
  Plug,
  Users,
  Brain,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    name: 'Deals',
    href: '/dashboard/deals',
    icon: Briefcase,
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    name: 'AI Scoring',
    href: '/dashboard/ai',
    icon: Brain,
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    name: 'Pipeline',
    href: '/dashboard/pipeline',
    icon: GitBranch,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Forecasts',
    href: '/dashboard/forecasts',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-amber-600',
  },
];

const settingsNav = [
  {
    name: 'Integrations',
    href: '/dashboard/settings/integrations',
    icon: Plug,
  },
  {
    name: 'Team',
    href: '/dashboard/settings/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      {/* Sidebar container with glass effect */}
      <div className="fixed top-0 left-0 z-30 flex h-screen w-72 flex-col border-r border-white/[0.06] bg-[#0A0520]/80 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 opacity-60 blur-md transition-opacity group-hover:opacity-80" />
              {/* Icon background */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">RevSignal</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-violet-400">
                AI Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {/* Main label */}
          <div className="mb-3 flex items-center gap-2 px-3">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Main
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>

          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                {/* Active background */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-white/[0.06] backdrop-blur-sm" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-transparent" />
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 shadow-lg shadow-violet-500/50" />
                  </>
                )}

                {/* Icon with gradient background */}
                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300',
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                      : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                  )}
                >
                  {isActive && (
                    <div className={cn('absolute inset-0 rounded-lg bg-gradient-to-br opacity-50 blur-md', item.gradient)} />
                  )}
                  <item.icon
                    className={cn(
                      'relative h-4 w-4 transition-colors',
                      isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    )}
                  />
                </div>

                <span className="relative flex-1">{item.name}</span>

                {/* Arrow indicator */}
                <ChevronRight
                  className={cn(
                    'relative h-4 w-4 transition-all duration-300',
                    isActive
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-50'
                  )}
                />
              </Link>
            );
          })}

          {/* Settings label */}
          <div className="mb-3 mt-6 flex items-center gap-2 px-3">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Settings
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>

          {settingsNav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-white/[0.06]" />
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
                  </>
                )}

                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                    isActive ? 'bg-white/[0.08]' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    )}
                  />
                </div>

                <span className="relative flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section - Pro upgrade card */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 p-4">
            {/* Decorative orb */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />

            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400">PRO FEATURES</span>
              </div>
              <p className="mb-3 text-xs text-white/50">
                Unlock advanced analytics and unlimited deal scoring
              </p>
              <button className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
