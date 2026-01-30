'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTRPC } from '@/hooks/use-trpc';
import {
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Target,
  DollarSign,
  Clock,
  Users,
  LayoutGrid,
  List,
  Zap,
  ChevronRight,
  Building2,
  Activity,
  AlertTriangle,
  Circle,
  Flame,
  Trophy,
  Rocket,
  Eye,
} from 'lucide-react';

// Format currency helper
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Calculate days until close date
function getDaysToClose(closeDate: Date | null): number | null {
  if (!closeDate) return null;
  const now = new Date();
  const close = new Date(closeDate);
  return Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// Pipeline stages configuration
const PIPELINE_STAGES = [
  {
    id: 'QUALIFICATION',
    name: 'Qualification',
    shortName: 'Qualify',
    icon: Target,
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/30',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
  },
  {
    id: 'DISCOVERY',
    name: 'Discovery',
    shortName: 'Discovery',
    icon: Eye,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
  },
  {
    id: 'PROPOSAL',
    name: 'Proposal',
    shortName: 'Proposal',
    icon: Building2,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    glow: 'shadow-pink-500/30',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
  },
  {
    id: 'NEGOTIATION',
    name: 'Negotiation',
    shortName: 'Negotiate',
    icon: Flame,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    glow: 'shadow-amber-500/30',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
  {
    id: 'CLOSED_WON',
    name: 'Closed Won',
    shortName: 'Won',
    icon: Trophy,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
];

// Deal type from API
interface DealFromAPI {
  id: string;
  name: string;
  amount: number | null;
  currency: string;
  stage: string;
  aiScore: number | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
  forecastCategory: 'COMMIT' | 'BEST_CASE' | 'PIPELINE' | 'OMIT' | null;
  expectedCloseDate: Date | null;
  status: string | null;
  account: { id: string; name: string } | null;
  owner: string | null;
  ownerId: string | null;
  contactCount: number;
  activityCount: number;
  lastActivityAt: Date | null;
  createdAt: Date;
}

// Score badge component
function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) return null;

  const getScoreStyle = (s: number) => {
    if (s >= 70) return 'from-emerald-500 to-emerald-600 shadow-emerald-500/30';
    if (s >= 40) return 'from-amber-500 to-amber-600 shadow-amber-500/30';
    return 'from-red-500 to-red-600 shadow-red-500/30';
  };

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${getScoreStyle(score)} text-xs font-bold text-white shadow-lg`}
    >
      {score}
    </div>
  );
}

// Deal card component for kanban view
function DealCard({ deal }: { deal: DealFromAPI }) {
  const isAtRisk = deal.riskLevel === 'HIGH' || deal.riskLevel === 'CRITICAL';
  const daysToClose = getDaysToClose(deal.expectedCloseDate);

  return (
    <Link
      href={`/dashboard/deals/${deal.id}`}
      className="group relative block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
    >
      {/* At-risk indicator */}
      {isAtRisk && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50">
          <AlertTriangle className="h-3 w-3 text-white" />
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium text-white group-hover:text-violet-300 transition-colors">
            {deal.name}
          </h4>
          <p className="truncate text-xs text-white/40">{deal.account?.name || 'No account'}</p>
        </div>
        <ScoreBadge score={deal.aiScore} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-white">{formatCurrency(deal.amount ?? 0)}</p>
        {daysToClose !== null && (
          <span
            className={`flex items-center gap-1 text-xs ${
              daysToClose < 0
                ? 'text-red-400'
                : daysToClose <= 7
                  ? 'text-amber-400'
                  : 'text-white/40'
            }`}
          >
            <Clock className="h-3 w-3" />
            {daysToClose < 0 ? 'Overdue' : `${daysToClose}d`}
          </span>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-3 right-3 opacity-0 transition-all group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4 text-violet-400" />
      </div>
    </Link>
  );
}

// Stage column component
function StageColumn({
  stage,
  deals,
  totalValue,
  dealCount,
}: {
  stage: (typeof PIPELINE_STAGES)[0];
  deals: DealFromAPI[];
  totalValue: number;
  dealCount: number;
}) {
  const StageIcon = stage.icon;

  return (
    <div className="flex min-w-[280px] flex-col lg:min-w-0">
      {/* Stage header */}
      <div
        className={`mb-4 rounded-xl border ${stage.borderColor} ${stage.bgColor} p-4 backdrop-blur-sm`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stage.gradient} shadow-lg ${stage.glow}`}
            >
              <StageIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{stage.shortName}</h3>
              <p className="text-xs text-white/40">{dealCount} deals</p>
            </div>
          </div>
        </div>
        <p className={`text-2xl font-bold ${stage.textColor}`}>{formatCurrency(totalValue)}</p>
      </div>

      {/* Deals list */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        {deals.length > 0 ? (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
            <Circle className="mb-2 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/30">No deals</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Animated flow arrow
function FlowArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center px-2 pt-24">
      <div className="relative">
        <ChevronRight className="h-5 w-5 text-white/20" />
        <div className="absolute inset-0 animate-pulse">
          <ChevronRight className="h-5 w-5 text-violet-500/50" />
        </div>
      </div>
    </div>
  );
}

// Pipeline velocity chart (simplified visual)
function VelocityChart({ velocity }: { velocity: number }) {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, velocity];

  return (
    <div className="flex h-16 items-end gap-1">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t transition-all duration-500 ${
            i === bars.length - 1
              ? 'bg-gradient-to-t from-violet-600 to-violet-400 shadow-lg shadow-violet-500/30'
              : 'bg-white/10'
          }`}
          style={{
            height: `${height}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function PipelineContent() {
  const trpc = useTRPC();
  const { data: deals, isLoading } = trpc.deals.list.useQuery({ limit: 500 });
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    if (!deals?.deals) return {} as Record<string, { deals: DealFromAPI[]; totalValue: number; count: number }>;

    return PIPELINE_STAGES.reduce(
      (acc, stage) => {
        const stageDeals = deals.deals.filter((deal) => {
          // Map deal stage to our stage IDs
          const dealStage = deal.stage?.toUpperCase().replace(' ', '_');
          return dealStage === stage.id || deal.stage === stage.name;
        }) as DealFromAPI[];

        acc[stage.id] = {
          deals: stageDeals,
          totalValue: stageDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0),
          count: stageDeals.length,
        };
        return acc;
      },
      {} as Record<string, { deals: DealFromAPI[]; totalValue: number; count: number }>
    );
  }, [deals]);

  // Calculate pipeline metrics
  const pipelineMetrics = useMemo(() => {
    if (!deals?.deals) return null;

    const totalDeals = deals.deals.length;
    const totalValue = deals.deals.reduce((sum, d) => sum + (d.amount ?? 0), 0);
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const atRiskDeals = deals.deals.filter(
      (d) => d.riskLevel === 'HIGH' || d.riskLevel === 'CRITICAL'
    ).length;
    const scoredDeals = deals.deals.filter((d) => d.aiScore !== null);
    const avgScore =
      scoredDeals.length > 0
        ? scoredDeals.reduce((sum, d) => sum + (d.aiScore ?? 0), 0) / scoredDeals.length
        : 0;

    return {
      totalDeals,
      totalValue,
      avgDealSize,
      atRiskDeals,
      avgScore: Math.round(avgScore),
    };
  }, [deals]);

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[500px] w-[500px] -right-48 -top-48 opacity-20" />
        <div className="orb orb-cyan h-[400px] w-[400px] -left-32 top-1/3 opacity-15" />
        <div className="orb orb-pink h-[300px] w-[300px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
              <Activity className="h-3 w-3" />
              Pipeline View
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Deal Pipeline</h1>
          <p className="mt-1 text-white/40">Visualize and manage your revenue pipeline</p>
        </div>

        <div className="animate-in-up delay-1 flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>

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
        </div>
      </div>

      {/* Pipeline Metrics - Bento Grid */}
      <div className="relative mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Pipeline */}
        <div className="animate-in-up delay-2 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.04] lg:col-span-2">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-white lg:text-4xl">
                {isLoading ? (
                  <span className="inline-block h-10 w-32 animate-pulse rounded bg-white/10" />
                ) : (
                  formatCurrency(pipelineMetrics?.totalValue ?? 0)
                )}
              </p>
              <p className="mt-1 text-sm text-white/40">Total Pipeline Value</p>
            </div>

            {/* Mini velocity chart */}
            <div className="w-24">
              <VelocityChart velocity={75} />
              <p className="mt-2 text-center text-xs text-white/30">Velocity</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">+18% vs last quarter</span>
          </div>
        </div>

        {/* Active Deals */}
        <div className="animate-in-up delay-3 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                pipelineMetrics?.totalDeals ?? 0
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">Active Deals</p>
          </div>
        </div>

        {/* Avg Deal Size */}
        <div className="animate-in-up delay-4 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-pink-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
              <Target className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-20 animate-pulse rounded bg-white/10" />
              ) : (
                formatCurrency(pipelineMetrics?.avgDealSize ?? 0)
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">Avg Deal Size</p>
          </div>
        </div>

        {/* At Risk */}
        <div className="animate-in-up delay-5 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              {(pipelineMetrics?.atRiskDeals ?? 0) > 0 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                  Action needed
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-amber-400 lg:text-3xl">
              {isLoading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-white/10" />
              ) : (
                pipelineMetrics?.atRiskDeals ?? 0
              )}
            </p>
            <p className="mt-1 text-sm text-white/40">At-Risk Deals</p>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="animate-in-up delay-6 mb-8 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/5 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Pipeline Analysis</h3>
              <p className="mt-1 text-sm text-white/60">
                <strong className="text-white">
                  {dealsByStage['NEGOTIATION']?.count || 0} deals in negotiation
                </strong>{' '}
                with a combined value of{' '}
                <strong className="text-emerald-400">
                  {formatCurrency(dealsByStage['NEGOTIATION']?.totalValue || 0)}
                </strong>
                . Focus here for maximum impact this quarter.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/ai"
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-violet-500/20 px-5 py-3 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30"
          >
            <Zap className="h-4 w-4" />
            View AI Insights
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Pipeline Kanban View */}
      {viewMode === 'kanban' && (
        <div className="animate-in-up delay-7">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 lg:gap-4 lg:grid lg:grid-cols-5">
              {PIPELINE_STAGES.map((stage, index) => (
                <div key={stage.id} className="contents">
                  <StageColumn
                    stage={stage}
                    deals={dealsByStage[stage.id]?.deals || []}
                    totalValue={dealsByStage[stage.id]?.totalValue || 0}
                    dealCount={dealsByStage[stage.id]?.count || 0}
                  />
                  {index < PIPELINE_STAGES.length - 1 && <FlowArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline List View */}
      {viewMode === 'list' && (
        <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          {/* List header */}
          <div className="grid grid-cols-12 gap-4 border-b border-white/[0.06] px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
            <div className="col-span-4">Deal</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-2 text-right">Value</div>
            <div className="col-span-2 text-center">AI Score</div>
            <div className="col-span-2 text-right">Close Date</div>
          </div>

          {/* List content */}
          <div className="divide-y divide-white/[0.04]">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-4">
                    <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
                    <div className="mt-1 h-4 w-24 animate-pulse rounded bg-white/5" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ))
            ) : deals?.deals.length ? (
              deals.deals.map((deal) => {
                const stage = PIPELINE_STAGES.find(
                  (s) =>
                    s.id === deal.stage?.toUpperCase().replace(' ', '_') || s.name === deal.stage
                );
                return (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="group grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white group-hover:text-violet-300 transition-colors">
                          {deal.name}
                        </p>
                        {(deal.riskLevel === 'HIGH' || deal.riskLevel === 'CRITICAL') && (
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/40">{deal.account?.name || 'No account'}</p>
                    </div>
                    <div className="col-span-2">
                      {stage && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full ${stage.bgColor} ${stage.borderColor} border px-2.5 py-1 text-xs font-medium ${stage.textColor}`}
                        >
                          <stage.icon className="h-3 w-3" />
                          {stage.shortName}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="font-semibold text-white">{formatCurrency(deal.amount ?? 0)}</p>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <ScoreBadge score={deal.aiScore} />
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm text-white/60">
                        {deal.expectedCloseDate
                          ? new Date(deal.expectedCloseDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <Rocket className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-white/60">No deals in your pipeline</p>
                <p className="mt-1 text-sm text-white/40">
                  Connect your CRM to start tracking deals
                </p>
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
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
