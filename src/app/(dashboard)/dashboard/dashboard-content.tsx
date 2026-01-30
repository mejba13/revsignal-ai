'use client';

import Link from 'next/link';
import { useMemo } from 'react';
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
  Calendar,
  BarChart3,
  Clock,
  Mail,
  Phone,
  Video,
  Rocket,
  Brain,
  ChevronRight,
  Layers,
  LineChart,
  CheckCircle2,
  Trophy,
  Flame,
  Eye,
  Building2,
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

// Get time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Animated score ring component with glow
function ScoreRing({ score, size = 100, label }: { score: number; size?: number; label?: string }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 70) return { gradient: ['#10B981', '#34D399'], glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400' };
    if (s >= 40) return { gradient: ['#F59E0B', '#FBBF24'], glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400' };
    return { gradient: ['#EF4444', '#F87171'], glow: 'rgba(239, 68, 68, 0.4)', text: 'text-red-400' };
  };

  const colors = getScoreColor(score);
  const gradientId = `scoreGradient-${score}-${size}`;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + (label ? 24 : 0) }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 10px ${colors.glow})`,
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ height: size }}>
        <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
      </div>
      {label && <span className="mt-2 text-xs text-white/40">{label}</span>}
    </div>
  );
}

// Activity type icon with glow
function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: typeof Mail; color: string; glow: string }> = {
    EMAIL: { icon: Mail, color: 'bg-emerald-500/20 text-emerald-400', glow: 'shadow-emerald-500/20' },
    CALL: { icon: Phone, color: 'bg-cyan-500/20 text-cyan-400', glow: 'shadow-cyan-500/20' },
    MEETING: { icon: Video, color: 'bg-violet-500/20 text-violet-400', glow: 'shadow-violet-500/20' },
    NOTE: { icon: Activity, color: 'bg-amber-500/20 text-amber-400', glow: 'shadow-amber-500/20' },
  };

  const { icon: Icon, color, glow } = icons[type] || icons.NOTE;

  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color} shadow-lg ${glow}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

// Pipeline stage mini card
function StageCard({ stage, count, value, icon: Icon, gradient, delay }: {
  stage: string;
  count: number;
  value: number;
  icon: typeof Target;
  gradient: string;
  delay: number;
}) {
  return (
    <div
      className="animate-in-up group relative flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:border-violet-500/20 hover:bg-white/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{stage}</p>
        <p className="text-xs text-white/40">{count} deals · {formatCurrency(value)}</p>
      </div>
    </div>
  );
}

// Quick action button
function QuickAction({ href, icon: Icon, label, description, gradient, glow }: {
  href: string;
  icon: typeof Rocket;
  label: string;
  description: string;
  gradient: string;
  glow: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg ${glow} transition-transform group-hover:scale-110`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-white group-hover:text-violet-300 transition-colors">{label}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-violet-400" />
    </Link>
  );
}

// Stat card with animated gradient border
function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  gradient,
  glow,
  trend,
  trendLabel,
  delay,
  isAlert,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: typeof DollarSign;
  gradient: string;
  glow: string;
  trend?: { value: number; positive: boolean };
  trendLabel?: string;
  delay: number;
  isAlert?: boolean;
}) {
  return (
    <div
      className={`animate-in-up group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:bg-white/[0.04] ${
        isAlert ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-white/[0.06] hover:border-violet-500/30'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow effect */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${glow} blur-3xl opacity-0 transition-opacity group-hover:opacity-100`} />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${trend.positive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              {trend.positive ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
              <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
          {trendLabel && (
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${isAlert ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
              {isAlert ? <AlertTriangle className="h-3 w-3 text-amber-400" /> : <Sparkles className="h-3 w-3 text-emerald-400" />}
              <span className={`text-xs font-medium ${isAlert ? 'text-amber-400' : 'text-emerald-400'}`}>{trendLabel}</span>
            </div>
          )}
        </div>

        <p className={`text-3xl font-bold ${isAlert ? 'text-amber-400' : 'text-white'}`}>{value}</p>
        <p className="mt-1 text-sm text-white/40">
          {label}
          {subtext && <span className="ml-2 text-white/30">{subtext}</span>}
        </p>
      </div>
    </div>
  );
}

export function DashboardContent({ userName }: DashboardContentProps) {
  const trpc = useTRPC();
  const { data: summary, isLoading } = trpc.dashboard.summary.useQuery();

  // Calculate pipeline by stage
  const stageData = useMemo(() => {
    if (!summary?.topDeals) return [];
    const stages: Record<string, { count: number; value: number }> = {};
    summary.topDeals.forEach((deal) => {
      if (!stages[deal.stage]) stages[deal.stage] = { count: 0, value: 0 };
      stages[deal.stage].count++;
      stages[deal.stage].value += deal.amount || 0;
    });
    return Object.entries(stages).map(([stage, data]) => ({ stage, ...data }));
  }, [summary]);

  const stageConfig: Record<string, { icon: typeof Target; gradient: string }> = {
    'Qualification': { icon: Target, gradient: 'from-violet-500 to-violet-600' },
    'Discovery': { icon: Eye, gradient: 'from-cyan-500 to-cyan-600' },
    'Proposal': { icon: Building2, gradient: 'from-pink-500 to-pink-600' },
    'Negotiation': { icon: Flame, gradient: 'from-amber-500 to-amber-600' },
    'Closed Won': { icon: Trophy, gradient: 'from-emerald-500 to-emerald-600' },
  };

  const greeting = getGreeting();

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[600px] w-[600px] -right-64 -top-64 opacity-20" />
        <div className="orb orb-cyan h-[500px] w-[500px] -left-48 top-1/4 opacity-15" />
        <div className="orb orb-pink h-[400px] w-[400px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-sm text-white/40">{greeting},</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
              <Sparkles className="h-3 w-3" />
              Pro User
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white lg:text-5xl">{userName}</h1>
          <p className="mt-2 text-white/40">Here&apos;s your revenue intelligence overview</p>
        </div>

        <div className="animate-in-up delay-1 flex flex-wrap items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-emerald-400">
              {isLoading ? 'Syncing...' : 'Live'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/30">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Stats Cards - Hero Row */}
      <div className="relative mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pipeline Value"
          value={isLoading ? '--' : formatCurrency(summary?.pipeline.value ?? 0)}
          subtext={isLoading ? '' : `${summary?.pipeline.count ?? 0} deals`}
          icon={DollarSign}
          gradient="from-violet-500 to-violet-600"
          glow="bg-violet-500/20"
          trend={{ value: 12, positive: true }}
          delay={200}
        />
        <StatCard
          label="Win Rate"
          value={isLoading ? '--' : `${summary?.performance.winRate ?? 0}%`}
          subtext={isLoading ? '' : `${summary?.performance.wonCount ?? 0} won`}
          icon={Target}
          gradient="from-cyan-500 to-cyan-600"
          glow="bg-cyan-500/20"
          trend={{ value: 5, positive: true }}
          delay={300}
        />
        <StatCard
          label="At-Risk Revenue"
          value={isLoading ? '--' : formatCurrency(summary?.atRisk.value ?? 0)}
          subtext={isLoading ? '' : `${summary?.atRisk.count ?? 0} deals`}
          icon={AlertTriangle}
          gradient="from-amber-500 to-amber-600"
          glow="bg-amber-500/20"
          trendLabel="Needs attention"
          delay={400}
          isAlert={(summary?.atRisk.count ?? 0) > 0}
        />
        <StatCard
          label="Avg AI Score"
          value={isLoading ? '--' : Math.round(summary?.pipeline.avgScore ?? 0)}
          icon={Zap}
          gradient="from-pink-500 to-pink-600"
          glow="bg-pink-500/20"
          trendLabel="Healthy"
          delay={500}
        />
      </div>

      {/* Main Bento Grid */}
      <div className="relative grid gap-6 lg:grid-cols-12">
        {/* AI Insights - Feature Card */}
        <div className="animate-in-up delay-6 lg:col-span-8">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 p-6 backdrop-blur-sm">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Revenue Intelligence</h3>
                    <p className="text-sm text-white/40">Powered by predictive analytics</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/ai"
                  className="flex items-center gap-1.5 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Insight Card 1 */}
                <div className="group/card rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-emerald-500/30 hover:bg-white/[0.04]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-emerald-400">Opportunity</span>
                  </div>
                  <p className="text-sm text-white/70">
                    <strong className="text-white">3 deals</strong> are showing strong buying signals. Engage now for higher close rates.
                  </p>
                </div>

                {/* Insight Card 2 */}
                <div className="group/card rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-xs font-medium text-amber-400">At Risk</span>
                  </div>
                  <p className="text-sm text-white/70">
                    <strong className="text-white">{summary?.atRisk.count ?? 0} deals</strong> need attention. Historical recovery rate is 73% with quick action.
                  </p>
                </div>

                {/* Insight Card 3 */}
                <div className="group/card rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/30 hover:bg-white/[0.04]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-xs font-medium text-cyan-400">Forecast</span>
                  </div>
                  <p className="text-sm text-white/70">
                    <strong className="text-white">Q1 target</strong> is 78% likely to be achieved based on current pipeline velocity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="animate-in-up delay-7 lg:col-span-4">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Pipeline Health</h3>
                  <p className="text-xs text-white/40">AI-scored confidence</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              {isLoading ? (
                <div className="h-[100px] w-[100px] animate-pulse rounded-full bg-white/[0.06]" />
              ) : (
                <ScoreRing score={Math.round(summary?.pipeline.avgScore ?? 0)} size={120} />
              )}
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-white">Average Score</p>
                <p className="text-xs text-white/40">Across {summary?.pipeline.count ?? 0} active deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Deals */}
        <div className="animate-in-up delay-8 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
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
                className="flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : summary?.topDeals.length ? (
                <div className="space-y-3">
                  {summary.topDeals.slice(0, 5).map((deal, i) => (
                    <Link
                      key={deal.id}
                      href={`/dashboard/deals/${deal.id}`}
                      className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                          i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-white/[0.06] text-white/60'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium text-white">{deal.name}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/30 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-violet-400" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <span className="truncate">{deal.accountName || 'No account'}</span>
                            <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
                            <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5">{deal.stage}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatCurrency(deal.amount)}</p>
                        </div>
                        {deal.aiScore !== null && (
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="animate-in-up delay-9 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Pipeline Stages</h3>
                  <p className="text-xs text-white/40">Deal distribution</p>
                </div>
              </div>
              <Link
                href="/dashboard/pipeline"
                className="flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                View pipeline
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : stageData.length > 0 ? (
                <div className="space-y-3">
                  {stageData.map((stage, i) => {
                    const config = stageConfig[stage.stage] || { icon: Target, gradient: 'from-gray-500 to-gray-600' };
                    return (
                      <StageCard
                        key={stage.stage}
                        stage={stage.stage}
                        count={stage.count}
                        value={stage.value}
                        icon={config.icon}
                        gradient={config.gradient}
                        delay={900 + i * 100}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Layers className="mx-auto mb-2 h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">No pipeline data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-in-up delay-10 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                  <p className="text-xs text-white/40">Latest updates</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : summary?.recentActivity.length ? (
                <div className="space-y-3">
                  {summary.recentActivity.slice(0, 5).map((activity) => (
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

        {/* Quick Actions */}
        <div className="animate-in-up delay-11 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/25">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Quick Actions</h3>
                  <p className="text-xs text-white/40">Get things done faster</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <QuickAction
                href="/dashboard/deals"
                icon={BarChart3}
                label="View All Deals"
                description="Browse and manage your pipeline"
                gradient="from-violet-500 to-violet-600"
                glow="shadow-violet-500/25"
              />
              <QuickAction
                href="/dashboard/ai"
                icon={Brain}
                label="AI Insights"
                description="Get predictive recommendations"
                gradient="from-cyan-500 to-cyan-600"
                glow="shadow-cyan-500/25"
              />
              <QuickAction
                href="/dashboard/forecasts"
                icon={LineChart}
                label="Revenue Forecast"
                description="View projections and targets"
                gradient="from-pink-500 to-pink-600"
                glow="shadow-pink-500/25"
              />
              <QuickAction
                href="/dashboard/settings/integrations"
                icon={Zap}
                label="Connect CRM"
                description="Sync Salesforce or HubSpot"
                gradient="from-amber-500 to-amber-600"
                glow="shadow-amber-500/25"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started - shown when no data */}
      {!isLoading && !summary?.pipeline.count && (
        <div className="animate-in-up delay-12 mt-8">
          <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Get Started with RevSignal AI</h3>
                  <p className="text-sm text-white/40">Set up in 3 simple steps</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Connect your CRM',
                    desc: 'Link Salesforce or HubSpot to start syncing deals',
                    href: '/dashboard/settings/integrations',
                    icon: Zap,
                    active: true,
                  },
                  {
                    step: 2,
                    title: 'View AI-scored deals',
                    desc: 'See predictions and risk scores for your pipeline',
                    icon: Brain,
                    active: false,
                  },
                  {
                    step: 3,
                    title: 'Take action on insights',
                    desc: 'Follow AI recommendations to close more deals',
                    icon: CheckCircle2,
                    active: false,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-center gap-4 rounded-xl border p-5 transition-all ${
                      item.active
                        ? 'border-violet-500/30 bg-violet-500/5'
                        : 'border-white/[0.04] bg-white/[0.02] opacity-50'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${
                        item.active
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-white/[0.06] text-white/40'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-violet-400">Step {item.step}</span>
                      </div>
                      <h4 className="font-medium text-white">{item.title}</h4>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                    {item.active && item.href && (
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                      >
                        Connect
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
