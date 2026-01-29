'use client';

import Link from 'next/link';
import { useTRPC } from '@/hooks/use-trpc';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Activity,
  Users,
  Calendar,
  BarChart3,
  Clock,
  Mail,
  Phone,
  Video,
} from 'lucide-react';

interface DashboardContentProps {
  userName: string;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Animated score ring component
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 70) return { gradient: ['#10B981', '#34D399'], glow: 'rgba(16, 185, 129, 0.5)' };
    if (score >= 40) return { gradient: ['#F59E0B', '#FBBF24'], glow: 'rgba(245, 158, 11, 0.5)' };
    return { gradient: ['#EF4444', '#F87171'], glow: 'rgba(239, 68, 68, 0.5)' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.gradient[0]} />
            <stop offset="100%" stopColor={colors.gradient[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#scoreGradient-${score})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow})`,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-white/40">Score</span>
      </div>
    </div>
  );
}

// Activity type icon
function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: typeof Mail; color: string }> = {
    EMAIL: { icon: Mail, color: 'bg-emerald-500/20 text-emerald-400' },
    CALL: { icon: Phone, color: 'bg-cyan-500/20 text-cyan-400' },
    MEETING: { icon: Video, color: 'bg-violet-500/20 text-violet-400' },
    NOTE: { icon: Activity, color: 'bg-amber-500/20 text-amber-400' },
  };

  const { icon: Icon, color } = icons[type] || icons.NOTE;

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

export function DashboardContent({ userName }: DashboardContentProps) {
  const trpc = useTRPC();
  const { data: summary, isLoading } = trpc.dashboard.summary.useQuery();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-white/40">Welcome back,</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
              <Sparkles className="h-3 w-3" />
              Pro User
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">{userName}</h1>
        </div>

        <div className="animate-in-up delay-1 flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {isLoading ? 'Syncing...' : 'Live'}
            </span>
          </div>

          <span className="text-xs text-white/30">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Cards - Bento Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pipeline Value */}
        <div className="animate-in-up delay-2 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">+12%</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-white lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-24 animate-pulse rounded bg-white/10" />
              ) : (
                formatCurrency(summary?.pipeline.value ?? 0)
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">
              Pipeline Value
              <span className="ml-2 text-white/30">
                {isLoading ? '' : `${summary?.pipeline.count ?? 0} deals`}
              </span>
            </p>
          </div>
        </div>

        {/* Win Rate */}
        <div className="animate-in-up delay-3 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">+5%</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-white lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                `${summary?.performance.winRate ?? 0}%`
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">
              Win Rate
              <span className="ml-2 text-white/30">
                {isLoading ? '' : `${summary?.performance.wonCount ?? 0} won`}
              </span>
            </p>
          </div>
        </div>

        {/* At-Risk Revenue */}
        <div className="animate-in-up delay-4 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
                <span className="text-xs font-medium text-amber-400">Needs attention</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-amber-400 lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-24 animate-pulse rounded bg-white/10" />
              ) : (
                formatCurrency(summary?.atRisk.value ?? 0)
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">
              At-Risk Revenue
              <span className="ml-2 text-white/30">
                {isLoading ? '' : `${summary?.atRisk.count ?? 0} deals`}
              </span>
            </p>
          </div>
        </div>

        {/* Avg AI Score */}
        <div className="animate-in-up delay-5 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-pink-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Healthy</span>
              </div>
            </div>

            <p className="text-2xl font-bold text-white lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-white/10" />
              ) : (
                Math.round(summary?.pipeline.avgScore ?? 0)
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">Avg AI Score</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Top Deals - Large Card */}
        <div className="animate-in-up delay-6 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Top Deals</h3>
                  <p className="text-xs text-white/40">Highest value opportunities</p>
                </div>
              </div>

              <Link
                href="/dashboard/deals"
                className="flex items-center gap-1 text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card Content */}
            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : summary?.topDeals.length ? (
                <div className="space-y-3">
                  {summary.topDeals.map((deal, i) => (
                    <Link
                      key={deal.id}
                      href={`/dashboard/deals/${deal.id}`}
                      className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sm font-bold text-white/60">
                          {i + 1}
                        </div>

                        {/* Deal Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{deal.name}</span>
                            <ArrowUpRight className="h-3 w-3 text-white/30 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <span>{deal.accountName || 'No account'}</span>
                            <span className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="rounded bg-white/[0.06] px-1.5 py-0.5">{deal.stage}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Amount */}
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatCurrency(deal.amount)}</p>
                        </div>

                        {/* AI Score */}
                        {deal.aiScore && (
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                              deal.aiScore >= 70
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                                : deal.aiScore >= 40
                                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30'
                                  : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                            }`}
                          >
                            {deal.aiScore}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <BarChart3 className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-white/60">No deals yet</p>
                  <p className="mt-1 text-sm text-white/40">Connect your CRM to get started</p>
                  <Link
                    href="/dashboard/settings/integrations"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-500/30"
                  >
                    Connect CRM
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-5">
          {/* AI Insights Card */}
          <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 backdrop-blur-sm">
            <div className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-violet-400">AI Recommendation</span>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-white/70">
                <strong className="text-white">3 deals need immediate attention</strong> — engagement has dropped significantly this week.
                Historical data shows 73% recovery rate when contacted within 48 hours.
              </p>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/20 px-4 py-3 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30">
                View At-Risk Deals
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-in-up delay-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                  <p className="text-xs text-white/40">Latest deal activities</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : summary?.recentActivity.length ? (
                <div className="space-y-3">
                  {summary.recentActivity.slice(0, 4).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <ActivityIcon type={activity.type} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {activity.subject || activity.type}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          {activity.dealName && <span className="truncate">{activity.dealName}</span>}
                          {activity.dealName && <span className="h-1 w-1 rounded-full bg-white/20" />}
                          <span>{activity.userName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Activity className="mx-auto mb-2 h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started - shown when no data */}
      {!isLoading && !summary?.pipeline.count && (
        <div className="animate-in-up delay-9 mt-8">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-5 w-5 text-violet-400" />
                Get Started with RevSignal AI
              </h3>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Connect your CRM',
                    desc: 'Link Salesforce or HubSpot to start syncing deals',
                    href: '/dashboard/settings/integrations',
                    active: true,
                  },
                  {
                    step: 2,
                    title: 'View AI-scored deals',
                    desc: 'See predictions and risk scores for your pipeline',
                    active: false,
                  },
                  {
                    step: 3,
                    title: 'Take action on insights',
                    desc: 'Follow AI recommendations to close more deals',
                    active: false,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      item.active
                        ? 'border-violet-500/30 bg-violet-500/5'
                        : 'border-white/[0.04] bg-white/[0.02] opacity-50'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                        item.active
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-white/[0.06] text-white/40'
                      }`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.title}</h4>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                    {item.active && item.href && (
                      <Link
                        href={item.href}
                        className="rounded-lg bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                      >
                        Connect
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
