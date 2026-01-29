'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

interface DashboardContentProps {
  userName: string;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function DashboardContent({ userName }: DashboardContentProps) {
  const trpc = useTRPC();
  const { data: summary, isLoading } = trpc.dashboard.summary.useQuery();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}</p>
        </div>
        <Badge variant="secondary">
          {isLoading ? 'Loading...' : 'Live'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : formatCurrency(summary?.pipeline.value ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : `${summary?.pipeline.count ?? 0} open deals`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : `${summary?.performance.winRate ?? 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? '--'
                : `${summary?.performance.wonCount ?? 0} won this month`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              At-Risk Revenue
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {isLoading ? '--' : formatCurrency(summary?.atRisk.value ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '--' : `${summary?.atRisk.count ?? 0} deals flagged`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg AI Score
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '--' : Math.round(summary?.pipeline.avgScore ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Pipeline health</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Top Deals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : summary?.topDeals.length ? (
              <div className="space-y-3">
                {summary.topDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{deal.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {deal.accountName || 'No account'} • {deal.stage}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(deal.amount)}
                        </div>
                      </div>
                      {deal.aiScore && (
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${
                            deal.aiScore >= 70
                              ? 'bg-green-500'
                              : deal.aiScore >= 40
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        >
                          {deal.aiScore}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No deals yet</p>
                <p className="text-sm">Connect your CRM to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : summary?.recentActivity.length ? (
              <div className="space-y-3">
                {summary.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full ${
                        activity.type === 'CALL'
                          ? 'bg-blue-500'
                          : activity.type === 'EMAIL'
                            ? 'bg-green-500'
                            : activity.type === 'MEETING'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {activity.subject || activity.type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.dealName && `${activity.dealName} • `}
                        {activity.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No activity yet</p>
                <p className="text-sm">Activity will appear once deals are synced</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started - shown when no data */}
      {!isLoading && !summary?.pipeline.count && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Get Started with RevSignal AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Connect your CRM</h3>
                  <p className="text-sm text-muted-foreground">
                    Link Salesforce or HubSpot to start syncing deals
                  </p>
                </div>
                <a
                  href="/dashboard/settings/integrations"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Connect
                </a>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-4 opacity-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">View AI-scored deals</h3>
                  <p className="text-sm text-muted-foreground">
                    See predictions and risk scores for your pipeline
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-4 opacity-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Take action on insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow AI recommendations to close more deals
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
