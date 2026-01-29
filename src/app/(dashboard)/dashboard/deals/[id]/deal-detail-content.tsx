'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import { AIInsightsCard } from '@/components/deals/ai-insights-card';
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  User,
  Mail,
  Phone,
  ExternalLink,
  Clock,
} from 'lucide-react';

interface DealDetailContentProps {
  dealId: string;
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

function formatCurrency(value: number | null): string {
  if (value === null) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date | string | null): string {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(date: Date | string | null): string {
  if (!date) return '--';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ScoreGauge({ score, size = 'lg' }: { score: number | null; size?: 'sm' | 'lg' }) {
  if (score === null) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-12 w-12 text-sm'}`}>
        --
      </div>
    );
  }

  const color =
    score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
  const bgColor =
    score >= 70 ? 'bg-green-500/10' : score >= 40 ? 'bg-yellow-500/10' : 'bg-red-500/10';

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full ${bgColor} ${size === 'lg' ? 'h-24 w-24' : 'h-12 w-12'}`}
    >
      <span className={`font-bold ${color} ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}>
        {score}
      </span>
      {size === 'lg' && (
        <span className="text-xs text-muted-foreground">AI Score</span>
      )}
    </div>
  );
}

export function DealDetailContent({ dealId }: DealDetailContentProps) {
  const trpc = useTRPC();
  const { data: deal, isLoading, error } = trpc.deals.get.useQuery({ id: dealId });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Deal not found</h2>
          <p className="mb-4 text-muted-foreground">
            The deal you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
          </p>
          <Link href="/dashboard/deals">
            <Button>Back to Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/deals"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deals
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{deal.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
              {deal.account && (
                <>
                  <Building2 className="h-4 w-4" />
                  <span>{deal.account.name}</span>
                  <span>•</span>
                </>
              )}
              <Badge variant="outline">{deal.stage}</Badge>
              <span>•</span>
              <span>{deal.status}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ScoreGauge score={deal.aiScore} />
            {deal.riskLevel && (
              <Badge className={`${RISK_COLORS[deal.riskLevel as RiskLevel]} text-white`}>
                {deal.riskLevel} Risk
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Amount</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {formatCurrency(deal.amount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Win Probability</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {deal.aiWinProbability
                    ? `${deal.aiWinProbability.toFixed(0)}%`
                    : '--'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Expected Close</span>
                </div>
                <div className="mt-1 text-lg font-bold">
                  {formatDate(deal.expectedCloseDate)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Days in Stage</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {deal.daysInStage ?? '--'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Score Factors */}
          {deal.aiScoreFactors && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(deal.aiScoreFactors as Record<string, number>).map(
                    ([factor, value]) => (
                      <div key={factor} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {factor.replace(/_/g, ' ')}
                            </span>
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
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {deal.riskFactors && Array.isArray(deal.riskFactors) && deal.riskFactors.length > 0 && (
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(deal.riskFactors as string[]).map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <TrendingDown className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {deal.recentActivities.length === 0 ? (
                <p className="text-muted-foreground">No activity recorded yet</p>
              ) : (
                <div className="space-y-4">
                  {deal.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className={`mt-1 h-2 w-2 rounded-full ${
                          activity.type === 'CALL'
                            ? 'bg-blue-500'
                            : activity.type === 'EMAIL'
                              ? 'bg-green-500'
                              : activity.type === 'MEETING'
                                ? 'bg-purple-500'
                                : 'bg-gray-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(activity.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">
                          {activity.subject || activity.description || 'No description'}
                        </p>
                        {activity.user && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            by {activity.user}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <AIInsightsCard dealId={dealId} />

          {/* Owner */}
          {deal.owner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deal Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {deal.owner.firstName[0]}
                    {deal.owner.lastName[0]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {deal.owner.firstName} {deal.owner.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {deal.owner.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Contacts ({deal.contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deal.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts linked</p>
              ) : (
                <div className="space-y-3">
                  {deal.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {contact.firstName[0]}
                        {contact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {contact.firstName} {contact.lastName}
                          </span>
                          {contact.isPrimary && (
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                        {contact.title && (
                          <div className="text-xs text-muted-foreground truncate">
                            {contact.title}
                          </div>
                        )}
                        {contact.role && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {contact.role}
                          </Badge>
                        )}
                        <div className="mt-2 flex gap-2">
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score History */}
          {deal.scoreHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Score History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deal.scoreHistory.map((score, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {formatDateTime(score.calculatedAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <ScoreGauge score={score.score} size="sm" />
                        <span className="text-muted-foreground">
                          {score.winProbability.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
