'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTRPC } from '@/hooks/use-trpc';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  PieChart,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
  Gauge,
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

// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Forecast categories configuration
const FORECAST_CATEGORIES = [
  {
    id: 'COMMIT',
    name: 'Commit',
    description: 'High confidence deals',
    icon: CheckCircle2,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
  },
  {
    id: 'BEST_CASE',
    name: 'Best Case',
    description: 'Probable deals',
    icon: Target,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    barColor: 'bg-cyan-500',
  },
  {
    id: 'PIPELINE',
    name: 'Pipeline',
    description: 'All active deals',
    icon: Layers,
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/30',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    barColor: 'bg-violet-500',
  },
];

// Quarter data type
interface QuarterData {
  quarter: string;
  target: number;
  commit: number;
  bestCase: number;
  pipeline: number;
  closed: number;
}

// Animated progress ring component
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = 'violet',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  const colorMap: Record<string, { gradient: string[]; glow: string }> = {
    violet: { gradient: ['#8B5CF6', '#A78BFA'], glow: 'rgba(139, 92, 246, 0.5)' },
    emerald: { gradient: ['#10B981', '#34D399'], glow: 'rgba(16, 185, 129, 0.5)' },
    cyan: { gradient: ['#06B6D4', '#22D3EE'], glow: 'rgba(6, 182, 212, 0.5)' },
    amber: { gradient: ['#F59E0B', '#FBBF24'], glow: 'rgba(245, 158, 11, 0.5)' },
  };

  const colors = colorMap[color] || colorMap.violet;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id={`ringGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke={`url(#ringGradient-${color})`}
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
        <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
        <span className="text-xs text-white/40">of target</span>
      </div>
    </div>
  );
}

// Forecast bar chart component
function ForecastBarChart({ data }: { data: QuarterData[] }) {
  const maxValue = Math.max(...data.flatMap((d) => [d.target, d.pipeline]));

  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((quarter, i) => (
        <div key={quarter.quarter} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-40 w-full items-end justify-center gap-1">
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-white/20"
              style={{ bottom: `${(quarter.target / maxValue) * 100}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/30">
                Target
              </span>
            </div>

            {/* Commit bar */}
            <div
              className="w-3 rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-700 ease-out"
              style={{
                height: `${(quarter.commit / maxValue) * 100}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />

            {/* Best Case bar */}
            <div
              className="w-3 rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-700 ease-out"
              style={{
                height: `${(quarter.bestCase / maxValue) * 100}%`,
                animationDelay: `${i * 100 + 50}ms`,
              }}
            />

            {/* Pipeline bar */}
            <div
              className="w-3 rounded-t bg-gradient-to-t from-violet-600 to-violet-400 transition-all duration-700 ease-out"
              style={{
                height: `${(quarter.pipeline / maxValue) * 100}%`,
                animationDelay: `${i * 100 + 100}ms`,
              }}
            />
          </div>
          <span className="text-xs font-medium text-white/50">{quarter.quarter}</span>
        </div>
      ))}
    </div>
  );
}

// Horizontal progress bar
function HorizontalProgressBar({
  value,
  max,
  color,
  showLabel = true,
}: {
  value: number;
  max: number;
  color: string;
  showLabel?: boolean;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-600 to-emerald-400',
    cyan: 'from-cyan-600 to-cyan-400',
    violet: 'from-violet-600 to-violet-400',
    amber: 'from-amber-600 to-amber-400',
    pink: 'from-pink-600 to-pink-400',
  };

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color] || colorClasses.violet} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-white/40">{formatCurrency(value)}</span>
          <span className="text-white/30">{formatPercent(percentage)}</span>
        </div>
      )}
    </div>
  );
}

// Accuracy gauge component
function AccuracyGauge({ accuracy }: { accuracy: number }) {
  const getAccuracyColor = (value: number) => {
    if (value >= 90) return { color: 'emerald', label: 'Excellent' };
    if (value >= 75) return { color: 'cyan', label: 'Good' };
    if (value >= 60) return { color: 'amber', label: 'Fair' };
    return { color: 'red', label: 'Needs Improvement' };
  };

  const { color, label } = getAccuracyColor(accuracy);

  return (
    <div className="flex flex-col items-center">
      <ProgressRing progress={accuracy} size={140} strokeWidth={12} color={color} />
      <div className="mt-3 text-center">
        <span
          className={`text-sm font-medium ${
            color === 'emerald'
              ? 'text-emerald-400'
              : color === 'cyan'
                ? 'text-cyan-400'
                : color === 'amber'
                  ? 'text-amber-400'
                  : 'text-red-400'
          }`}
        >
          {label}
        </span>
        <p className="mt-1 text-xs text-white/40">Forecast Accuracy</p>
      </div>
    </div>
  );
}

// Mini trend indicator
function TrendIndicator({ value, positive }: { value: number; positive: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value > 0 ? '+' : ''}
      {value}%
    </div>
  );
}

export function ForecastsContent() {
  const trpc = useTRPC();
  const { data: deals, isLoading } = trpc.deals.list.useQuery({ limit: 500 });
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2026');

  // Calculate forecast metrics from deals
  const forecastMetrics = useMemo(() => {
    if (!deals?.deals) {
      return {
        commit: 0,
        bestCase: 0,
        pipeline: 0,
        target: 2500000,
        closed: 0,
        accuracy: 87,
        commitDeals: 0,
        bestCaseDeals: 0,
        pipelineDeals: 0,
      };
    }

    const commitDeals = deals.deals.filter((d) => d.forecastCategory === 'COMMIT');
    const bestCaseDeals = deals.deals.filter((d) => d.forecastCategory === 'BEST_CASE');
    const pipelineDeals = deals.deals.filter(
      (d) => d.forecastCategory === 'PIPELINE' || !d.forecastCategory
    );

    const commit = commitDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0);
    const bestCase = bestCaseDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0);
    const pipeline = deals.deals.reduce((sum, d) => sum + (d.amount ?? 0), 0);

    // Calculate closed won (status WON)
    const closedDeals = deals.deals.filter((d) => d.status === 'WON');
    const closed = closedDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0);

    return {
      commit,
      bestCase: commit + bestCase,
      pipeline,
      target: 2500000,
      closed,
      accuracy: 87, // Mock accuracy
      commitDeals: commitDeals.length,
      bestCaseDeals: bestCaseDeals.length,
      pipelineDeals: pipelineDeals.length,
    };
  }, [deals]);

  // Mock quarterly data
  const quarterlyData: QuarterData[] = [
    {
      quarter: 'Q1',
      target: 2500000,
      commit: forecastMetrics.commit * 0.3,
      bestCase: forecastMetrics.bestCase * 0.3,
      pipeline: forecastMetrics.pipeline * 0.3,
      closed: forecastMetrics.closed,
    },
    {
      quarter: 'Q2',
      target: 2800000,
      commit: forecastMetrics.commit * 0.35,
      bestCase: forecastMetrics.bestCase * 0.35,
      pipeline: forecastMetrics.pipeline * 0.35,
      closed: 0,
    },
    {
      quarter: 'Q3',
      target: 3000000,
      commit: forecastMetrics.commit * 0.2,
      bestCase: forecastMetrics.bestCase * 0.2,
      pipeline: forecastMetrics.pipeline * 0.2,
      closed: 0,
    },
    {
      quarter: 'Q4',
      target: 3200000,
      commit: forecastMetrics.commit * 0.15,
      bestCase: forecastMetrics.bestCase * 0.15,
      pipeline: forecastMetrics.pipeline * 0.15,
      closed: 0,
    },
  ];

  // Coverage calculation
  const commitCoverage = forecastMetrics.target > 0 ? (forecastMetrics.commit / forecastMetrics.target) * 100 : 0;
  const bestCaseCoverage = forecastMetrics.target > 0 ? (forecastMetrics.bestCase / forecastMetrics.target) * 100 : 0;
  const pipelineCoverage = forecastMetrics.target > 0 ? (forecastMetrics.pipeline / forecastMetrics.target) * 100 : 0;

  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[600px] w-[600px] -right-64 -top-64 opacity-20" />
        <div className="orb orb-cyan h-[400px] w-[400px] -left-32 top-1/4 opacity-15" />
        <div className="orb orb-pink h-[350px] w-[350px] right-1/3 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              <TrendingUp className="h-3 w-3" />
              Revenue Forecasting
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Forecasts</h1>
          <p className="mt-1 text-white/40">AI-powered revenue predictions and pipeline coverage</p>
        </div>

        <div className="animate-in-up delay-1 flex items-center gap-3">
          {/* Quarter selector */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.02] p-1">
            {quarters.map((quarter) => (
              <button
                key={quarter}
                onClick={() => setSelectedQuarter(quarter)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedQuarter === quarter
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {quarter.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {isLoading ? 'Calculating...' : 'Live'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Forecast Metrics - Bento Grid */}
      <div className="relative mb-8 grid gap-4 lg:grid-cols-12">
        {/* Target Progress - Large Card */}
        <div className="animate-in-up delay-2 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.04] lg:col-span-5">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedQuarter} Target</h3>
                  <p className="text-sm text-white/40">Revenue goal progress</p>
                </div>
              </div>

              <p className="mb-1 text-4xl font-bold text-white">
                {isLoading ? (
                  <span className="inline-block h-10 w-32 animate-pulse rounded bg-white/10" />
                ) : (
                  formatCurrency(forecastMetrics.target)
                )}
              </p>
              <p className="text-sm text-white/40">
                {formatCurrency(forecastMetrics.closed)} closed ·{' '}
                {formatCurrency(forecastMetrics.target - forecastMetrics.closed)} remaining
              </p>

              <div className="mt-4">
                <HorizontalProgressBar
                  value={forecastMetrics.closed}
                  max={forecastMetrics.target}
                  color="violet"
                />
              </div>
            </div>

            <div className="ml-6">
              <ProgressRing
                progress={(forecastMetrics.closed / forecastMetrics.target) * 100}
                size={120}
                color="violet"
              />
            </div>
          </div>
        </div>

        {/* Forecast Categories - 3 Cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          {FORECAST_CATEGORIES.map((category, i) => {
            const value =
              category.id === 'COMMIT'
                ? forecastMetrics.commit
                : category.id === 'BEST_CASE'
                  ? forecastMetrics.bestCase
                  : forecastMetrics.pipeline;
            const dealCount =
              category.id === 'COMMIT'
                ? forecastMetrics.commitDeals
                : category.id === 'BEST_CASE'
                  ? forecastMetrics.bestCaseDeals
                  : forecastMetrics.pipelineDeals;
            const coverage =
              category.id === 'COMMIT'
                ? commitCoverage
                : category.id === 'BEST_CASE'
                  ? bestCaseCoverage
                  : pipelineCoverage;

            const CategoryIcon = category.icon;

            return (
              <div
                key={category.id}
                className={`animate-in-up group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:${category.borderColor} hover:bg-white/[0.04]`}
                style={{ animationDelay: `${(i + 3) * 100}ms` }}
              >
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${category.bgColor} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg ${category.glow}`}
                    >
                      <CategoryIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${category.textColor}`}>
                      {formatPercent(coverage)} coverage
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-white">
                    {isLoading ? (
                      <span className="inline-block h-8 w-24 animate-pulse rounded bg-white/10" />
                    ) : (
                      formatCurrency(value)
                    )}
                  </p>
                  <p className="mt-1 text-sm text-white/40">
                    {category.name}{' '}
                    <span className="text-white/30">· {dealCount} deals</span>
                  </p>

                  <div className="mt-3">
                    <HorizontalProgressBar
                      value={value}
                      max={forecastMetrics.target}
                      color={category.color}
                      showLabel={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Row - Charts and Insights */}
      <div className="mb-8 grid gap-6 lg:grid-cols-12">
        {/* Quarterly Forecast Chart */}
        <div className="animate-in-up delay-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Quarterly Forecast</h3>
                <p className="text-xs text-white/40">Revenue projection by quarter</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-white/50">Commit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                <span className="text-white/50">Best Case</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-white/50">Pipeline</span>
              </div>
            </div>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="flex h-48 items-end gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1">
                    <div className="h-32 animate-pulse rounded-t bg-white/5" />
                  </div>
                ))}
              </div>
            ) : (
              <ForecastBarChart data={quarterlyData} />
            )}
          </div>
        </div>

        {/* Forecast Accuracy & AI Insights */}
        <div className="space-y-6 lg:col-span-5">
          {/* Accuracy Card */}
          <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                    <Gauge className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Forecast Accuracy</h3>
                    <p className="text-xs text-white/40">Last 4 quarters</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Q4 2025</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">94%</span>
                      <TrendIndicator value={3} positive />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Q3 2025</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">91%</span>
                      <TrendIndicator value={5} positive />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Q2 2025</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">86%</span>
                      <TrendIndicator value={-2} positive={false} />
                    </div>
                  </div>
                </div>
              </div>

              <AccuracyGauge accuracy={forecastMetrics.accuracy} />
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="animate-in-up delay-8 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-violet-400">AI Forecast Insights</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80">
                    <strong className="text-white">Strong Q1 outlook</strong> — Commit coverage at{' '}
                    {formatPercent(commitCoverage)} with 3 deals likely to close this month.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-white/80">
                    <strong className="text-white">Pipeline gap detected</strong> — Need{' '}
                    {formatCurrency(Math.max(0, forecastMetrics.target * 3 - forecastMetrics.pipeline))}{' '}
                    more pipeline for healthy 3x coverage.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/ai"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-violet-500/20 px-4 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30"
            >
              <Zap className="h-4 w-4" />
              View Full Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Forecast Breakdown by Category */}
      <div className="animate-in-up delay-9 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Forecast Breakdown</h3>
              <p className="text-xs text-white/40">Deals by forecast category</p>
            </div>
          </div>

          <Link
            href="/dashboard/deals"
            className="flex items-center gap-1 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            View all deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {FORECAST_CATEGORIES.map((category) => {
                const value =
                  category.id === 'COMMIT'
                    ? forecastMetrics.commit
                    : category.id === 'BEST_CASE'
                      ? forecastMetrics.bestCase
                      : forecastMetrics.pipeline;
                const dealCount =
                  category.id === 'COMMIT'
                    ? forecastMetrics.commitDeals
                    : category.id === 'BEST_CASE'
                      ? forecastMetrics.bestCaseDeals
                      : forecastMetrics.pipelineDeals;
                const percentOfTotal =
                  forecastMetrics.pipeline > 0 ? (value / forecastMetrics.pipeline) * 100 : 0;

                const CategoryIcon = category.icon;

                return (
                  <div
                    key={category.id}
                    className={`group relative overflow-hidden rounded-xl border ${category.borderColor} ${category.bgColor} p-4 transition-all hover:bg-white/[0.04]`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.gradient} shadow-lg ${category.glow}`}
                        >
                          <CategoryIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-white">{category.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1" />
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">{formatCurrency(value)}</p>
                        <p className="text-xs text-white/40">
                          {dealCount} deals · {formatPercent(percentOfTotal)} of pipeline
                        </p>
                      </div>

                      {/* Mini visual */}
                      <div className="flex h-12 items-end gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 rounded-t ${category.barColor} opacity-${20 + i * 20}`}
                            style={{
                              height: `${20 + Math.random() * 80}%`,
                              opacity: 0.2 + i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
