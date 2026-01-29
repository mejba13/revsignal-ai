'use client';

import { useState } from 'react';
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
} from 'lucide-react';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; gradient: string }> = {
  LOW: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
  MEDIUM: { bg: 'bg-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-orange-600' },
  CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400', gradient: 'from-red-500 to-red-600' },
};

// Animated score ring component
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 70) return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' };
    if (score >= 40) return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' };
    return { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' };
  };

  const colors = getScoreColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
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
          stroke={colors.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 12px ${colors.glow})`,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{Math.round(score)}</span>
        <span className="text-sm text-white/40">Avg Score</span>
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 opacity-60 blur-md" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white lg:text-3xl">AI Scoring</h1>
              <p className="text-sm text-white/40">GPT-4 powered deal health analysis</p>
            </div>
          </div>
        </div>

        {/* Model Badge */}
        <div className="animate-in-up delay-1 flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-400">GPT-4 Turbo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Deals */}
        <div className="animate-in-up delay-2 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-cyan-500/30">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-white/40">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Total Deals</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                stats?.totalDeals
              )}
            </div>
          </div>
        </div>

        {/* Scored */}
        <div className="animate-in-up delay-3 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-emerald-500/30">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-white/40">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Scored</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                stats?.scoredDeals
              )}
            </div>
            <div className="mt-1 text-xs text-emerald-400">
              {isLoading ? '' : `${stats?.coveragePercent}% coverage`}
            </div>
          </div>
        </div>

        {/* Unscored */}
        <div className="animate-in-up delay-4 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-amber-500/30">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-white/40">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Unscored</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                stats?.unscoredDeals
              )}
            </div>
          </div>
        </div>

        {/* Stale Scores */}
        <div className="animate-in-up delay-5 group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-violet-500/30">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-white/40">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Stale Scores</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                stats?.staleScores
              )}
            </div>
            <div className="mt-1 text-xs text-white/40">Older than 24h</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bulk Scoring Actions */}
        <div className="animate-in-up delay-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Bulk Scoring</h3>
                <p className="text-xs text-white/40">Run AI analysis on multiple deals</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <p className="text-sm text-white/50">
              Run AI scoring on multiple deals at once. This uses GPT-4 to analyze deal
              health, calculate win probability, and identify risk factors.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleScoreUnscored}
                disabled={isScoring || scoreMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isScoring ? 'animate-spin' : ''}`} />
                Score Unscored
              </button>
              <button
                onClick={handleBulkScore}
                disabled={isScoring || scoreMutation.isPending}
                className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isScoring ? 'animate-spin' : ''}`} />
                Refresh All
              </button>
            </div>

            {/* Scoring Result */}
            {scoringResult && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-medium text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  Scoring Complete
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{scoringResult.total}</div>
                    <div className="text-xs text-white/40">Processed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{scoringResult.successful}</div>
                    <div className="text-xs text-white/40">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{scoringResult.failed}</div>
                    <div className="text-xs text-white/40">Failed</div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress indicator */}
            {(isScoring || scoreMutation.isPending) && (
              <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Analyzing deals with GPT-4...</p>
                  <p className="text-xs text-white/40">This may take a minute</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Risk Distribution</h3>
                <p className="text-xs text-white/40">Deal health breakdown</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-white/[0.06]" />
                ))}
              </div>
            ) : stats?.distribution && stats.distribution.length > 0 ? (
              <div className="space-y-4">
                {stats.distribution.map((d) => {
                  const config = RISK_CONFIG[d.riskLevel as RiskLevel];
                  const percentage = Math.round((d.count / (stats.scoredDeals || 1)) * 100);

                  return (
                    <div key={d.riskLevel} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${config.text}`}>
                          {d.riskLevel}
                        </span>
                        <span className="text-sm text-white/60">{d.count} deals</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
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

            {/* Average Score Ring */}
            {stats?.averageScore !== null && stats?.averageScore !== undefined && (
              <div className="mt-8 flex justify-center">
                <ScoreRing score={stats.averageScore} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="animate-in-up delay-8 mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20">
              <Brain className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">Model: GPT-4 Turbo (MVP)</span>
              <p className="text-xs text-white/40">Scores are recalculated every 24 hours or on demand</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Clock className="h-3.5 w-3.5" />
            Last run: Just now
          </div>
        </div>
      </div>
    </div>
  );
}
