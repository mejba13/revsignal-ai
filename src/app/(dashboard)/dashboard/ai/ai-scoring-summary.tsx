'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Brain,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  Users,
  DollarSign,
  Layers,
  ChevronRight,
  Cpu,
  Gauge,
  PieChart,
} from 'lucide-react';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; gradient: string; glow: string; icon: typeof Shield }> = {
  LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/20', icon: Shield },
  MEDIUM: { bg: 'bg-amber-500/10', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600', glow: 'shadow-amber-500/20', icon: AlertTriangle },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400', gradient: 'from-orange-500 to-orange-600', glow: 'shadow-orange-500/20', icon: AlertTriangle },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', gradient: 'from-red-500 to-red-600', glow: 'shadow-red-500/20', icon: AlertTriangle },
};

// Animated score ring component with enhanced glow
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 70) return { gradient: ['#10B981', '#34D399'], glow: 'rgba(16, 185, 129, 0.5)', text: 'text-emerald-400', label: 'Healthy' };
    if (s >= 40) return { gradient: ['#F59E0B', '#FBBF24'], glow: 'rgba(245, 158, 11, 0.5)', text: 'text-amber-400', label: 'Moderate' };
    return { gradient: ['#EF4444', '#F87171'], glow: 'rgba(239, 68, 68, 0.5)', text: 'text-red-400', label: 'At Risk' };
  };

  const colors = getScoreColor(score);
  const gradientId = `scoreRingGradient-${score}-${size}`;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-2 rounded-full blur-xl opacity-50"
        style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
      />

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
            filter: `drop-shadow(0 0 15px ${colors.glow})`,
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${colors.text}`}>{Math.round(score)}</span>
        <span className="text-sm text-white/40 mt-1">Avg Score</span>
        <span className={`text-xs font-medium ${colors.text} mt-1`}>{colors.label}</span>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  gradient,
  glow,
  delay,
  highlight,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: typeof BarChart3;
  gradient: string;
  glow: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`animate-in-up group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:bg-white/[0.04] ${
        highlight ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-white/[0.06] hover:border-violet-500/30'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${glow} blur-3xl opacity-0 transition-opacity group-hover:opacity-100`} />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <p className={`text-3xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
        <p className="mt-1 text-sm text-white/40">{label}</p>
        {subtext && <p className={`mt-1 text-xs ${highlight ? 'text-amber-400/70' : 'text-emerald-400'}`}>{subtext}</p>}
      </div>
    </div>
  );
}

// Scoring factor card
function ScoringFactorCard({
  icon: Icon,
  title,
  description,
  weight,
  gradient,
  delay,
}: {
  icon: typeof Activity;
  title: string;
  description: string;
  weight: string;
  gradient: string;
  delay: number;
}) {
  return (
    <div
      className="animate-in-up group flex items-start gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20 hover:bg-white/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-white">{title}</h4>
          <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400">{weight}</span>
        </div>
        <p className="mt-1 text-xs text-white/40">{description}</p>
      </div>
    </div>
  );
}

export function AIScoringSummary() {
  const [isScoring, setIsScoring] = useState(false);
  const [scoringResult, setScoringResult] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  const trpc = useTRPC();

  const { data: stats, isLoading, refetch } = trpc.ai.scoringStats.useQuery();

  const scoreMutation = trpc.ai.scoreDeals.useMutation({
    onSuccess: (result) => {
      setScoringResult({
        total: result.total,
        successful: result.successful,
        failed: result.failed,
      });
      setIsScoring(false);
      refetch();
    },
    onError: () => {
      setIsScoring(false);
    },
  });

  const handleBulkScore = async () => {
    setIsScoring(true);
    setScoringResult(null);
    scoreMutation.mutate({ limit: 50, onlyUnscored: false });
  };

  const handleScoreUnscored = async () => {
    setIsScoring(true);
    setScoringResult(null);
    scoreMutation.mutate({ limit: 50, onlyUnscored: true });
  };

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[600px] w-[600px] -right-64 -top-64 opacity-20" />
        <div className="orb orb-cyan h-[500px] w-[500px] -left-48 top-1/3 opacity-15" />
        <div className="orb orb-pink h-[400px] w-[400px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-medium text-pink-400">
              <Brain className="h-3 w-3" />
              AI Powered
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">AI Scoring</h1>
          <p className="mt-1 text-white/40">GPT-4 powered deal health analysis and win probability prediction</p>
        </div>

        <div className="animate-in-up delay-1 flex flex-wrap items-center gap-3">
          {/* Model Badge */}
          <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">GPT-4 Turbo</span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Deals"
          value={isLoading ? '--' : stats?.totalDeals ?? 0}
          icon={BarChart3}
          gradient="from-cyan-500 to-cyan-600"
          glow="bg-cyan-500/20"
          delay={200}
        />
        <StatCard
          label="Scored"
          value={isLoading ? '--' : stats?.scoredDeals ?? 0}
          subtext={isLoading ? undefined : `${stats?.coveragePercent ?? 0}% coverage`}
          icon={CheckCircle}
          gradient="from-emerald-500 to-emerald-600"
          glow="bg-emerald-500/20"
          delay={300}
        />
        <StatCard
          label="Unscored"
          value={isLoading ? '--' : stats?.unscoredDeals ?? 0}
          icon={AlertTriangle}
          gradient="from-amber-500 to-amber-600"
          glow="bg-amber-500/20"
          delay={400}
          highlight={(stats?.unscoredDeals ?? 0) > 0}
        />
        <StatCard
          label="Stale Scores"
          value={isLoading ? '--' : stats?.staleScores ?? 0}
          subtext="Older than 24h"
          icon={Clock}
          gradient="from-violet-500 to-violet-600"
          glow="bg-violet-500/20"
          delay={500}
        />
      </div>

      {/* Main Bento Grid */}
      <div className="relative grid gap-6 lg:grid-cols-12">
        {/* AI Analysis Panel */}
        <div className="animate-in-up delay-6 lg:col-span-8">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/5 p-6 backdrop-blur-sm">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Bulk Scoring Engine</h3>
                    <p className="text-sm text-white/40">Run AI analysis on multiple deals</p>
                  </div>
                </div>
              </div>

              <p className="mb-6 text-sm text-white/60">
                Leverage GPT-4&apos;s advanced reasoning to analyze deal health, calculate win probability,
                and identify risk factors across your entire pipeline.
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  onClick={handleScoreUnscored}
                  disabled={isScoring || scoreMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:opacity-50 sm:flex-none"
                >
                  <RefreshCw className={`h-4 w-4 ${isScoring ? 'animate-spin' : ''}`} />
                  Score Unscored Deals
                </button>
                <button
                  onClick={handleBulkScore}
                  disabled={isScoring || scoreMutation.isPending}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isScoring ? 'animate-spin' : ''}`} />
                  Refresh All Scores
                </button>
              </div>

              {/* Progress indicator */}
              {(isScoring || scoreMutation.isPending) && (
                <div className="mb-6 flex items-center gap-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" />
                    <Brain className="absolute inset-2 h-6 w-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Analyzing deals with GPT-4...</p>
                    <p className="text-xs text-white/40">Processing deal data and generating insights</p>
                  </div>
                </div>
              )}

              {/* Scoring Result */}
              {scoringResult && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <h4 className="font-semibold text-emerald-400">Scoring Complete</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{scoringResult.total}</div>
                      <div className="text-xs text-white/40">Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">{scoringResult.successful}</div>
                      <div className="text-xs text-white/40">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">{scoringResult.failed}</div>
                      <div className="text-xs text-white/40">Failed</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="animate-in-up delay-7 lg:col-span-4">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
                  <Gauge className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Pipeline Health</h3>
                  <p className="text-xs text-white/40">Average AI score</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              {isLoading ? (
                <div className="h-[160px] w-[160px] animate-pulse rounded-full bg-white/[0.06]" />
              ) : stats?.averageScore !== null && stats?.averageScore !== undefined ? (
                <ScoreRing score={stats.averageScore} />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <PieChart className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-white/60">No scores yet</p>
                  <p className="mt-1 text-xs text-white/40">Run scoring to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="animate-in-up delay-8 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Risk Distribution</h3>
                  <p className="text-xs text-white/40">Deal health breakdown</p>
                </div>
              </div>
              <Link
                href="/dashboard/deals?risk=HIGH"
                className="flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                View at-risk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.06]" />
                  ))}
                </div>
              ) : stats?.distribution && stats.distribution.length > 0 ? (
                <div className="space-y-4">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => {
                    const d = stats.distribution.find((x) => x.riskLevel === level);
                    const count = d?.count ?? 0;
                    const config = RISK_CONFIG[level];
                    const percentage = stats.scoredDeals ? Math.round((count / stats.scoredDeals) * 100) : 0;
                    const Icon = config.icon;

                    return (
                      <div key={level} className="group">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bg}`}>
                              <Icon className={`h-3.5 w-3.5 ${config.text}`} />
                            </div>
                            <span className={`text-sm font-medium ${config.text}`}>{level}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">{count} deals</span>
                            <span className="text-xs text-white/30">({percentage}%)</span>
                          </div>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <AlertTriangle className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-white/60">No scored deals yet</p>
                  <p className="mt-1 text-sm text-white/40">Run bulk scoring to see distribution</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scoring Factors */}
        <div className="animate-in-up delay-9 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Scoring Factors</h3>
                  <p className="text-xs text-white/40">What AI considers when scoring</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <ScoringFactorCard
                icon={Activity}
                title="Engagement Level"
                description="Recent activity, email opens, meeting frequency"
                weight="25%"
                gradient="from-violet-500 to-violet-600"
                delay={900}
              />
              <ScoringFactorCard
                icon={TrendingUp}
                title="Deal Velocity"
                description="Stage progression speed vs historical average"
                weight="20%"
                gradient="from-cyan-500 to-cyan-600"
                delay={950}
              />
              <ScoringFactorCard
                icon={Users}
                title="Stakeholder Access"
                description="Decision maker involvement and engagement"
                weight="20%"
                gradient="from-pink-500 to-pink-600"
                delay={1000}
              />
              <ScoringFactorCard
                icon={Clock}
                title="Recency"
                description="Time since last meaningful interaction"
                weight="15%"
                gradient="from-amber-500 to-amber-600"
                delay={1050}
              />
              <ScoringFactorCard
                icon={DollarSign}
                title="Deal Strength"
                description="Deal size, stage, and forecast category"
                weight="20%"
                gradient="from-emerald-500 to-emerald-600"
                delay={1100}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-in-up delay-10 lg:col-span-12">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Model: GPT-4 Turbo</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">Active</span>
                  </div>
                  <p className="text-xs text-white/40">Scores are recalculated every 24 hours or on demand</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-2 text-xs text-white/40 sm:flex">
                  <Clock className="h-3.5 w-3.5" />
                  Last run: {isLoading ? '--' : 'Just now'}
                </div>

                <Link
                  href="/dashboard/deals"
                  className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  View All Deals
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
