'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  Sparkles,
  LayoutGrid,
  List,
  Target,
  DollarSign,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  ChevronDown,
  Eye,
  Flame,
  Trophy,
  Users,
} from 'lucide-react';

type SortBy = 'amount' | 'aiScore' | 'expectedCloseDate' | 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Risk level configuration
const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; label: string; border: string }> = {
  LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Low Risk', border: 'border-emerald-500/30' },
  MEDIUM: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Medium', border: 'border-amber-500/30' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'High Risk', border: 'border-orange-500/30' },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Critical', border: 'border-red-500/30' },
};

// Stage configuration
const STAGE_CONFIG: Record<string, { icon: typeof Target; gradient: string; glow: string; bg: string; text: string }> = {
  'Qualification': { icon: Target, gradient: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  'Discovery': { icon: Eye, gradient: 'from-cyan-500 to-cyan-600', glow: 'shadow-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  'Proposal': { icon: Building2, gradient: 'from-pink-500 to-pink-600', glow: 'shadow-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'Negotiation': { icon: Flame, gradient: 'from-amber-500 to-amber-600', glow: 'shadow-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'Closed Won': { icon: Trophy, gradient: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

// Default stage config
const DEFAULT_STAGE_CONFIG = { icon: Activity, gradient: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30', bg: 'bg-white/5', text: 'text-white/60' };

function formatCurrency(value: number | null): string {
  if (value === null) return '--';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function formatDate(date: Date | string | null): string {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Calculate days until close
function getDaysUntilClose(date: Date | string | null): number | null {
  if (!date) return null;
  const closeDate = new Date(date);
  const today = new Date();
  return Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Score badge with animated ring
function ScoreBadge({ score, size = 'default' }: { score: number | null; size?: 'small' | 'default' | 'large' }) {
  if (score === null) return <span className="text-white/30">--</span>;

  const getScoreConfig = (s: number) => {
    if (s >= 70) return { gradient: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/40', ring: 'border-emerald-500/30' };
    if (s >= 40) return { gradient: 'from-amber-500 to-amber-600', glow: 'shadow-amber-500/40', ring: 'border-amber-500/30' };
    return { gradient: 'from-red-500 to-red-600', glow: 'shadow-red-500/40', ring: 'border-red-500/30' };
  };

  const config = getScoreConfig(score);
  const sizeClasses = {
    small: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    large: 'h-14 w-14 text-lg',
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} font-bold text-white shadow-lg ${config.glow} ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 rounded-full border-2 ${config.ring} animate-pulse`} />
      {score}
    </div>
  );
}

// Stage badge component
function StageBadge({ stage }: { stage: string }) {
  const config = STAGE_CONFIG[stage] || DEFAULT_STAGE_CONFIG;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border ${config.bg} px-2.5 py-1 text-xs font-medium ${config.text}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <Icon className="h-3 w-3" />
      {stage}
    </span>
  );
}

// Deal card component for grid view
function DealCard({ deal }: { deal: DealType }) {
  const daysUntilClose = getDaysUntilClose(deal.expectedCloseDate);
  const isOverdue = daysUntilClose !== null && daysUntilClose < 0;
  const isUrgent = daysUntilClose !== null && daysUntilClose >= 0 && daysUntilClose <= 7;
  const isAtRisk = deal.riskLevel === 'HIGH' || deal.riskLevel === 'CRITICAL';

  return (
    <Link
      href={`/dashboard/deals/${deal.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
    >
      {/* Risk indicator dot */}
      {isAtRisk && (
        <div className="absolute right-3 top-3 flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ScoreBadge score={deal.aiScore} />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white group-hover:text-violet-300 transition-colors">
              {deal.name}
            </h3>
            <p className="truncate text-xs text-white/40">{deal.account?.name || 'No account'}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/20 opacity-0 transition-all group-hover:opacity-100 group-hover:text-violet-400" />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">{formatCurrency(deal.amount)}</p>
      </div>

      {/* Stage & Meta */}
      <div className="mt-auto flex items-center justify-between">
        <StageBadge stage={deal.stage} />

        <div className="flex items-center gap-3">
          {/* Risk badge */}
          {deal.riskLevel && (
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${RISK_CONFIG[deal.riskLevel as RiskLevel].bg} ${RISK_CONFIG[deal.riskLevel as RiskLevel].text}`}>
              {RISK_CONFIG[deal.riskLevel as RiskLevel].label}
            </span>
          )}
        </div>
      </div>

      {/* Footer - Close date */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-4">
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Users className="h-3 w-3" />
          {deal.owner || 'Unassigned'}
        </div>

        {deal.expectedCloseDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-white/40'}`}>
            <Clock className="h-3 w-3" />
            {isOverdue ? 'Overdue' : daysUntilClose === 0 ? 'Today' : `${daysUntilClose}d`}
          </div>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

// Stats card component
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
  delay,
}: {
  label: string;
  value: string | number;
  icon: typeof DollarSign;
  gradient: string;
  trend?: { value: number; positive: boolean };
  delay: number;
}) {
  return (
    <div
      className="animate-in-up group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-violet-500/20 hover:bg-white/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div>
          <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/40">{label}</p>
        </div>

        {trend && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${trend.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
}

// Deal type
type DealType = {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  aiScore: number | null;
  riskLevel: string | null;
  expectedCloseDate: Date | string | null;
  account: { id: string; name: string } | null;
  owner: string | null;
  createdAt: Date | string;
};

export function DealsContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState<SortBy>(
    (searchParams.get('sortBy') as SortBy) || 'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get('sortOrder') as SortOrder) || 'desc'
  );
  const [riskFilter, setRiskFilter] = useState<RiskLevel | undefined>(
    searchParams.get('risk') as RiskLevel | undefined
  );
  const [stageFilter, setStageFilter] = useState<string | undefined>(
    searchParams.get('stage') || undefined
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const trpc = useTRPC();
  const { data, isLoading, error } = trpc.deals.list.useQuery({
    page,
    limit: viewMode === 'grid' ? 12 : 25,
    search: search || undefined,
    sortBy,
    sortOrder,
    riskLevel: riskFilter,
    stage: stageFilter,
  });

  // Calculate stats from deals
  const stats = useMemo(() => {
    if (!data?.deals) return null;

    const deals = data.deals as DealType[];
    const totalValue = deals.reduce((sum, d) => sum + (d.amount ?? 0), 0);
    const avgScore = deals.filter(d => d.aiScore).reduce((sum, d) => sum + (d.aiScore ?? 0), 0) / (deals.filter(d => d.aiScore).length || 1);
    const atRiskCount = deals.filter(d => d.riskLevel === 'HIGH' || d.riskLevel === 'CRITICAL').length;
    const closingSoon = deals.filter(d => {
      const days = getDaysUntilClose(d.expectedCloseDate);
      return days !== null && days >= 0 && days <= 14;
    }).length;

    return {
      totalValue,
      avgScore: Math.round(avgScore),
      atRiskCount,
      closingSoon,
      totalDeals: data.pagination.total,
    };
  }, [data]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setRiskFilter(undefined);
    setStageFilter(undefined);
    setPage(1);
  };

  const hasFilters = search || riskFilter || stageFilter;

  const stages = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              <Briefcase className="h-3 w-3" />
              Deal Management
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Deals</h1>
          <p className="mt-1 text-white/40">
            {isLoading ? 'Loading...' : `${data?.pagination.total || 0} deals in your pipeline`}
          </p>
        </div>

        <div className="animate-in-up delay-1 flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
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

      {/* Stats Cards */}
      <div className="relative mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Pipeline"
          value={stats ? formatCurrency(stats.totalValue) : '--'}
          icon={DollarSign}
          gradient="from-violet-500 to-violet-600"
          trend={{ value: 12, positive: true }}
          delay={200}
        />
        <StatCard
          label="Active Deals"
          value={stats?.totalDeals ?? '--'}
          icon={Briefcase}
          gradient="from-cyan-500 to-cyan-600"
          delay={300}
        />
        <StatCard
          label="Avg AI Score"
          value={stats?.avgScore ?? '--'}
          icon={Sparkles}
          gradient="from-pink-500 to-pink-600"
          trend={{ value: 5, positive: true }}
          delay={400}
        />
        <StatCard
          label="At Risk"
          value={stats?.atRiskCount ?? 0}
          icon={AlertTriangle}
          gradient="from-amber-500 to-amber-600"
          delay={500}
        />
      </div>

      {/* Filters */}
      <div className="animate-in-up delay-6 mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search deals by name or account..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Stage Filter */}
          <div className="relative">
            <select
              value={stageFilter || ''}
              onChange={(e) => setStageFilter(e.target.value || undefined)}
              className="h-10 appearance-none rounded-xl border border-white/[0.06] bg-white/[0.04] pl-4 pr-10 text-sm text-white outline-none transition-all focus:border-violet-500/50"
            >
              <option value="">All Stages</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <select
              value={riskFilter || ''}
              onChange={(e) => setRiskFilter((e.target.value as RiskLevel) || undefined)}
              className="h-10 appearance-none rounded-xl border border-white/[0.06] bg-white/[0.04] pl-4 pr-10 text-sm text-white outline-none transition-all focus:border-violet-500/50"
            >
              <option value="">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [SortBy, SortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="h-10 appearance-none rounded-xl border border-white/[0.06] bg-white/[0.04] pl-4 pr-10 text-sm text-white outline-none transition-all focus:border-violet-500/50"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="amount-desc">Highest Value</option>
              <option value="amount-asc">Lowest Value</option>
              <option value="aiScore-desc">Highest Score</option>
              <option value="aiScore-asc">Lowest Score</option>
              <option value="expectedCloseDate-asc">Closing Soon</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="animate-in-up delay-7 flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-white/60">Failed to load deals</p>
          <p className="mt-1 text-sm text-white/40">Please try refreshing the page</p>
        </div>
      ) : isLoading ? (
        viewMode === 'grid' ? (
          <div className="animate-in-up delay-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                </div>
                <div className="mb-4 h-8 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-6 w-20 animate-pulse rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-white/[0.04] p-5">
                <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : data?.deals.length === 0 ? (
        <div className="animate-in-up delay-7 flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
            <Briefcase className="h-8 w-8 text-white/30" />
          </div>
          <p className="text-white/60">No deals found</p>
          <p className="mt-1 text-sm text-white/40">
            {hasFilters ? 'Try adjusting your filters' : 'Connect your CRM to import deals'}
          </p>
          {hasFilters ? (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/30"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/dashboard/settings/integrations"
              className="mt-4 flex items-center gap-2 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/30"
            >
              <Zap className="h-4 w-4" />
              Connect CRM
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="animate-in-up delay-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data?.deals as DealType[]).map((deal, i) => (
            <div key={deal.id} style={{ animationDelay: `${700 + i * 50}ms` }} className="animate-in-up">
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          {/* Table Header */}
          <div className="hidden border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-wider text-white/40 md:grid md:grid-cols-12 md:gap-4">
            <div className="col-span-1">Score</div>
            <div className="col-span-3">
              <button className="flex items-center gap-1 hover:text-white" onClick={() => handleSort('name')}>
                Deal {sortBy === 'name' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
              </button>
            </div>
            <div className="col-span-2">
              <button className="flex items-center gap-1 hover:text-white" onClick={() => handleSort('amount')}>
                Amount {sortBy === 'amount' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
              </button>
            </div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-2">Risk</div>
            <div className="col-span-2">
              <button className="flex items-center gap-1 hover:text-white" onClick={() => handleSort('expectedCloseDate')}>
                Close Date {sortBy === 'expectedCloseDate' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
              </button>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/[0.04]">
            {(data?.deals as DealType[]).map((deal) => (
              <Link
                key={deal.id}
                href={`/dashboard/deals/${deal.id}`}
                className="group flex flex-col gap-3 p-5 transition-all hover:bg-white/[0.02] md:grid md:grid-cols-12 md:items-center md:gap-4"
              >
                {/* Score */}
                <div className="col-span-1">
                  <ScoreBadge score={deal.aiScore} />
                </div>

                {/* Deal Info */}
                <div className="col-span-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white group-hover:text-violet-300 transition-colors">{deal.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/30 opacity-0 transition-all group-hover:opacity-100 group-hover:text-violet-400" />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{deal.account?.name || 'No account'}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-2 text-lg font-semibold text-white">
                  {formatCurrency(deal.amount)}
                </div>

                {/* Stage */}
                <div className="col-span-2">
                  <StageBadge stage={deal.stage} />
                </div>

                {/* Risk */}
                <div className="col-span-2">
                  {deal.riskLevel ? (
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${RISK_CONFIG[deal.riskLevel as RiskLevel].bg} ${RISK_CONFIG[deal.riskLevel as RiskLevel].text}`}>
                      {deal.riskLevel === 'HIGH' || deal.riskLevel === 'CRITICAL' ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : null}
                      {RISK_CONFIG[deal.riskLevel as RiskLevel].label}
                    </span>
                  ) : (
                    <span className="text-sm text-white/30">--</span>
                  )}
                </div>

                {/* Close Date */}
                <div className="col-span-2">
                  {deal.expectedCloseDate ? (
                    <div className={`flex items-center gap-1.5 text-sm ${
                      getDaysUntilClose(deal.expectedCloseDate)! < 0
                        ? 'text-red-400'
                        : getDaysUntilClose(deal.expectedCloseDate)! <= 7
                          ? 'text-amber-400'
                          : 'text-white/50'
                    }`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(deal.expectedCloseDate)}
                    </div>
                  ) : (
                    <span className="text-sm text-white/30">--</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="animate-in-up delay-8 mt-6 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="text-sm text-white/40">
            Showing {(page - 1) * (viewMode === 'grid' ? 12 : 25) + 1} to{' '}
            {Math.min(page * (viewMode === 'grid' ? 12 : 25), data.pagination.total)} of{' '}
            {data.pagination.total} deals
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      page === pageNum
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {data.pagination.totalPages > 5 && (
                <>
                  <span className="px-2 text-white/30">...</span>
                  <button
                    onClick={() => setPage(data.pagination.totalPages)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      page === data.pagination.totalPages
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {data.pagination.totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
