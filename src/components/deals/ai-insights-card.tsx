'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Brain,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Clock,
} from 'lucide-react';

interface AIInsightsCardProps {
  dealId: string;
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

export function AIInsightsCard({ dealId }: AIInsightsCardProps) {
  const [isScoring, setIsScoring] = useState(false);
  const trpc = useTRPC();

  const {
    data: aiScore,
    isLoading,
    refetch,
  } = trpc.ai.getDealScore.useQuery({ dealId });

  const scoreMutation = trpc.ai.scoreDeal.useMutation({
    onSuccess: () => {
      refetch();
      setIsScoring(false);
    },
    onError: () => {
      setIsScoring(false);
    },
  });

  const handleRescore = async () => {
    setIsScoring(true);
    scoreMutation.mutate({ dealId });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded bg-muted" />
            <div className="h-32 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const factors = aiScore?.factors as Record<string, number> | null;
  const riskFactors = aiScore?.riskFactors as string[] | null;
  const recommendations = aiScore?.recommendations as string[] | null;

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRescore}
            disabled={isScoring || scoreMutation.isPending}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isScoring || scoreMutation.isPending ? 'animate-spin' : ''}`}
            />
            {isScoring || scoreMutation.isPending ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Overview */}
        {aiScore?.score !== null && aiScore?.score !== undefined ? (
          <div className="flex items-center gap-6">
            {/* Score Circle */}
            <div
              className={`flex h-20 w-20 flex-col items-center justify-center rounded-full ${
                aiScore.score >= 70
                  ? 'bg-green-500/10'
                  : aiScore.score >= 40
                    ? 'bg-yellow-500/10'
                    : 'bg-red-500/10'
              }`}
            >
              <span
                className={`text-3xl font-bold ${
                  aiScore.score >= 70
                    ? 'text-green-500'
                    : aiScore.score >= 40
                      ? 'text-yellow-500'
                      : 'text-red-500'
                }`}
              >
                {aiScore.score}
              </span>
              <span className="text-xs text-muted-foreground">Health</span>
            </div>

            {/* Win Probability & Risk */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Win Probability:</span>
                <span className="font-semibold">
                  {aiScore.winProbability ? `${aiScore.winProbability.toFixed(0)}%` : '--'}
                </span>
              </div>
              {aiScore.riskLevel && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Risk Level:</span>
                  <Badge className={`${RISK_COLORS[aiScore.riskLevel as RiskLevel]} text-white`}>
                    {aiScore.riskLevel}
                  </Badge>
                </div>
              )}
              {aiScore.isStale && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Score may be outdated</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No AI score available. Click Refresh to analyze this deal.
            </p>
          </div>
        )}

        {/* Summary */}
        {aiScore?.summary && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm">{aiScore.summary}</p>
          </div>
        )}

        {/* Score Factors */}
        {factors && Object.keys(factors).length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium">Score Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(factors).map(([factor, value]) => (
                <div key={factor} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{factor.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${
                          value >= 70
                            ? 'bg-green-500'
                            : value >= 40
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {riskFactors && riskFactors.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-600">
              <TrendingDown className="h-4 w-4" />
              Risk Factors
            </h4>
            <ul className="space-y-2">
              {riskFactors.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-green-600">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Last Scored */}
        {aiScore?.scoredAt && (
          <div className="text-xs text-muted-foreground">
            Last analyzed:{' '}
            {new Date(aiScore.scoredAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
