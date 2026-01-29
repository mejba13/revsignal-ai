'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
} from 'lucide-react';

type SortBy = 'amount' | 'aiScore' | 'expectedCloseDate' | 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical',
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
  if (score === null) return <span className="text-muted-foreground">--</span>;

  const color =
    score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${color}`}
    >
      {score}
    </div>
  );
}

export function DealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? 'Loading...'
              : `${data?.pagination.total || 0} deals in your pipeline`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={riskFilter || ''}
                onChange={(e) =>
                  setRiskFilter((e.target.value as RiskLevel) || undefined)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
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
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {data?.deals.length || 0} of {data?.pagination.total || 0}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center text-red-500">
              Failed to load deals. Please try again.
            </div>
          ) : isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.deals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No deals found</p>
              {hasFilters && (
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground md:flex">
                <div className="w-10" />
                <button
                  className="flex flex-1 items-center gap-1 hover:text-foreground"
                  onClick={() => handleSort('name')}
                >
                  Deal
                  {sortBy === 'name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
                <button
                  className="flex w-28 items-center gap-1 hover:text-foreground"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortBy === 'amount' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
                <div className="w-28">Stage</div>
                <button
                  className="flex w-24 items-center gap-1 hover:text-foreground"
                  onClick={() => handleSort('aiScore')}
                >
                  Score
                  {sortBy === 'aiScore' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
                <div className="w-24">Risk</div>
                <button
                  className="flex w-28 items-center gap-1 hover:text-foreground"
                  onClick={() => handleSort('expectedCloseDate')}
                >
                  Close Date
                  {sortBy === 'expectedCloseDate' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {data?.deals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:gap-0"
                  >
                    {/* Score Badge */}
                    <div className="hidden w-10 md:block">
                      <ScoreBadge score={deal.aiScore} />
                    </div>

                    {/* Deal Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {deal.name}
                        </span>
                        <span className="md:hidden">
                          <ScoreBadge score={deal.aiScore} />
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {deal.account?.name || 'No account'} • {deal.owner}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="w-28 font-medium">
                      {formatCurrency(deal.amount)}
                    </div>

                    {/* Stage */}
                    <div className="w-28">
                      <Badge variant="outline" className="font-normal">
                        {deal.stage}
                      </Badge>
                    </div>

                    {/* Score (desktop) */}
                    <div className="hidden w-24 md:block">
                      <ScoreBadge score={deal.aiScore} />
                    </div>

                    {/* Risk */}
                    <div className="w-24">
                      {deal.riskLevel ? (
                        <Badge
                          className={`${RISK_COLORS[deal.riskLevel as RiskLevel]} text-white`}
                        >
                          {RISK_LABELS[deal.riskLevel as RiskLevel]}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">--</span>
                      )}
                    </div>

                    {/* Close Date */}
                    <div className="w-28 text-sm text-muted-foreground">
                      {formatDate(deal.expectedCloseDate)}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
