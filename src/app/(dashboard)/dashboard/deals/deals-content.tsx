'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Building2,
  Sparkles,
} from 'lucide-react';

type SortBy = 'amount' | 'aiScore' | 'expectedCloseDate' | 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  LOW: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Low Risk' },
  MEDIUM: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Medium' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'High Risk' },
  CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Critical' },
};

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
    year: 'numeric',
  });
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-white/30">--</span>;

  const getScoreStyles = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-emerald-600 shadow-emerald-500/30';
    if (score >= 40) return 'from-amber-500 to-amber-600 shadow-amber-500/30';
    return 'from-red-500 to-red-600 shadow-red-500/30';
  };

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg ${getScoreStyles(score)}`}
    >
      {score}
    </div>
  );
}

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

  const trpc = useTRPC();
  const { data, isLoading, error } = trpc.deals.list.useQuery({
    page,
    limit: 25,
    search: search || undefined,
    sortBy,
    sortOrder,
    riskLevel: riskFilter,
    stage: stageFilter,
  });

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

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white lg:text-3xl">Deals</h1>
              <p className="text-sm text-white/40">
                {isLoading
                  ? 'Loading...'
                  : `${data?.pagination.total || 0} deals in your pipeline`}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-in-up delay-1 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-white/60">
              {data?.pagination.total || 0} Active
            </span>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="animate-in-up delay-2 mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search deals..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/40" />
              <select
                value={riskFilter || ''}
                onChange={(e) =>
                  setRiskFilter((e.target.value as RiskLevel) || undefined)
                }
                className="h-10 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 text-sm text-white outline-none transition-all focus:border-violet-500/50"
              >
                <option value="">All Risk Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="animate-in-up delay-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        {/* Table Header */}
        <div className="hidden border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-sm font-medium text-white/40 md:flex">
          <div className="w-12" />
          <button
            className="flex flex-1 items-center gap-1 transition-colors hover:text-white"
            onClick={() => handleSort('name')}
          >
            Deal
            {sortBy === 'name' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
          </button>
          <button
            className="flex w-28 items-center gap-1 transition-colors hover:text-white"
            onClick={() => handleSort('amount')}
          >
            Amount
            {sortBy === 'amount' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
          </button>
          <div className="w-28">Stage</div>
          <button
            className="flex w-20 items-center gap-1 transition-colors hover:text-white"
            onClick={() => handleSort('aiScore')}
          >
            Score
            {sortBy === 'aiScore' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
          </button>
          <div className="w-24">Risk</div>
          <button
            className="flex w-28 items-center gap-1 transition-colors hover:text-white"
            onClick={() => handleSort('expectedCloseDate')}
          >
            Close Date
            {sortBy === 'expectedCloseDate' && <ArrowUpDown className="h-3 w-3 text-violet-400" />}
          </button>
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <X className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-white/60">Failed to load deals</p>
            <p className="mt-1 text-sm text-white/40">Please try again</p>
          </div>
        ) : isLoading ? (
          <div className="divide-y divide-white/[0.04]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-5">
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Briefcase className="h-8 w-8 text-white/30" />
            </div>
            <p className="text-white/60">No deals found</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-violet-400 hover:text-violet-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {data?.deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/dashboard/deals/${deal.id}`}
                className="group flex flex-col gap-3 p-5 transition-all hover:bg-white/[0.02] md:flex-row md:items-center md:gap-0"
              >
                {/* Score Badge (Desktop) */}
                <div className="hidden w-12 md:block">
                  <ScoreBadge score={deal.aiScore} />
                </div>

                {/* Deal Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{deal.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/30 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    {/* Mobile Score */}
                    <span className="md:hidden">
                      <ScoreBadge score={deal.aiScore} />
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                    <Building2 className="h-3 w-3" />
                    <span>{deal.account?.name || 'No account'}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{deal.owner}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="w-28 font-semibold text-white">
                  {formatCurrency(deal.amount)}
                </div>

                {/* Stage */}
                <div className="w-28">
                  <span className="inline-flex rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/70">
                    {deal.stage}
                  </span>
                </div>

                {/* Score (Desktop) */}
                <div className="hidden w-20 md:block">
                  <ScoreBadge score={deal.aiScore} />
                </div>

                {/* Risk */}
                <div className="w-24">
                  {deal.riskLevel ? (
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                        RISK_CONFIG[deal.riskLevel as RiskLevel].bg
                      } ${RISK_CONFIG[deal.riskLevel as RiskLevel].text}`}
                    >
                      {RISK_CONFIG[deal.riskLevel as RiskLevel].label}
                    </span>
                  ) : (
                    <span className="text-sm text-white/30">--</span>
                  )}
                </div>

                {/* Close Date */}
                <div className="flex w-28 items-center gap-1.5 text-sm text-white/40">
                  <Calendar className="h-3 w-3" />
                  {formatDate(deal.expectedCloseDate)}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] p-4">
            <div className="text-sm text-white/40">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-white/60 transition-all hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-white/60 transition-all hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
