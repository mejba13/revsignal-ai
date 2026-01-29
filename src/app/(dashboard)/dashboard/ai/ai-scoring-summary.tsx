'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Brain,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
} from 'lucide-react';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Brain className="h-8 w-8 text-purple-500" />
            AI Scoring
          </h1>
          <p className="text-muted-foreground">
            GPT-4 powered deal health analysis and risk detection
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Total Deals</span>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoading ? '--' : stats?.totalDeals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Scored</span>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoading ? '--' : stats?.scoredDeals}
            </div>
            <div className="text-xs text-muted-foreground">
              {isLoading ? '' : `${stats?.coveragePercent}% coverage`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Unscored</span>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoading ? '--' : stats?.unscoredDeals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Stale Scores</span>
            </div>
            <div className="mt-1 text-2xl font-bold">
              {isLoading ? '--' : stats?.staleScores}
            </div>
            <div className="text-xs text-muted-foreground">Older than 24h</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bulk Scoring Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Bulk Scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Run AI scoring on multiple deals at once. This uses GPT-4 to analyze deal
              health, calculate win probability, and identify risk factors.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleScoreUnscored}
                disabled={isScoring || scoreMutation.isPending}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isScoring ? 'animate-spin' : ''}`}
                />
                Score Unscored
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkScore}
                disabled={isScoring || scoreMutation.isPending}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isScoring ? 'animate-spin' : ''}`}
                />
                Refresh All
              </Button>
            </div>

            {/* Scoring Result */}
            {scoringResult && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Scoring Complete</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{scoringResult.total}</div>
                    <div className="text-xs text-muted-foreground">Processed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {scoringResult.successful}
                    </div>
                    <div className="text-xs text-muted-foreground">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      {scoringResult.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress indicator */}
            {(isScoring || scoreMutation.isPending) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing deals with GPT-4... This may take a minute.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : stats?.distribution && stats.distribution.length > 0 ? (
              <div className="space-y-3">
                {stats.distribution.map((d) => (
                  <div key={d.riskLevel} className="flex items-center gap-3">
                    <Badge
                      className={`${RISK_COLORS[d.riskLevel as RiskLevel]} w-20 justify-center text-white`}
                    >
                      {d.riskLevel}
                    </Badge>
                    <div className="flex-1">
                      <div className="h-6 rounded bg-muted">
                        <div
                          className={`h-6 rounded ${RISK_COLORS[d.riskLevel as RiskLevel]}`}
                          style={{
                            width: `${(d.count / (stats.scoredDeals || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                <p>No scored deals yet</p>
                <p className="text-sm">Run bulk scoring to see risk distribution</p>
              </div>
            )}

            {/* Average Score */}
            {stats?.averageScore !== null && stats?.averageScore !== undefined && (
              <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                <div className="text-3xl font-bold">
                  {Math.round(stats.averageScore)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Deal Health Score
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model Info */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>Model: GPT-4 Turbo (MVP)</span>
            </div>
            <div className="text-muted-foreground">
              Scores are recalculated every 24 hours or on demand
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
