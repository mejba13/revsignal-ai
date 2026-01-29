'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/hooks/use-trpc';
import { Check, X, RefreshCw, ExternalLink } from 'lucide-react';

const CRM_PROVIDERS = [
  {
    id: 'SALESFORCE',
    name: 'Salesforce',
    description: 'Sync deals, accounts, and contacts from Salesforce CRM',
    icon: '☁️',
    connectUrl: '/api/integrations/salesforce',
    available: true,
  },
  {
    id: 'HUBSPOT',
    name: 'HubSpot',
    description: 'Sync deals, companies, and contacts from HubSpot CRM',
    icon: '🟠',
    connectUrl: '/api/integrations/hubspot',
    available: true,
  },
  {
    id: 'PIPEDRIVE',
    name: 'Pipedrive',
    description: 'Sync deals, organizations, and contacts from Pipedrive',
    icon: '🟢',
    connectUrl: null,
    available: false,
  },
  {
    id: 'ZOHO',
    name: 'Zoho CRM',
    description: 'Sync deals, accounts, and contacts from Zoho CRM',
    icon: '🔴',
    connectUrl: null,
    available: false,
  },
] as const;

function IntegrationsContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  const trpc = useTRPC();
  const { data: integrations, isLoading, refetch } = trpc.integrations.list.useQuery();
  const syncMutation = trpc.integrations.sync.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const disconnectMutation = trpc.integrations.disconnect.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const getIntegrationStatus = (providerId: string) => {
    return integrations?.find((i) => i.provider === providerId);
  };

  const handleSync = (provider: 'SALESFORCE' | 'HUBSPOT' | 'PIPEDRIVE' | 'ZOHO') => {
    syncMutation.mutate({ provider });
  };

  const handleDisconnect = (provider: 'SALESFORCE' | 'HUBSPOT' | 'PIPEDRIVE' | 'ZOHO') => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      disconnectMutation.mutate({ provider });
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {decodeURIComponent(success)}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4" />
            {decodeURIComponent(error)}
          </div>
        </div>
      )}

      {/* CRM Integrations */}
      <div className="grid gap-4 md:grid-cols-2">
        {CRM_PROVIDERS.map((provider) => {
          const integration = getIntegrationStatus(provider.id);
          const isConnected = integration?.status === 'CONNECTED';
          const isSyncing = integration?.status === 'SYNCING';

          return (
            <Card key={provider.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {provider.description}
                      </CardDescription>
                    </div>
                  </div>
                  {isConnected && (
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                  )}
                  {isSyncing && (
                    <Badge variant="secondary">
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Syncing
                    </Badge>
                  )}
                  {!provider.available && (
                    <Badge variant="outline">Coming Soon</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded bg-muted" />
                ) : isConnected ? (
                  <div className="space-y-3">
                    {integration?.lastSyncAt && (
                      <p className="text-xs text-muted-foreground">
                        Last synced:{' '}
                        {new Date(integration.lastSyncAt).toLocaleString()}
                      </p>
                    )}
                    {integration?.syncError && (
                      <p className="text-xs text-red-500">
                        Error: {integration.syncError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={isSyncing || syncMutation.isPending}
                      >
                        <RefreshCw
                          className={`mr-2 h-4 w-4 ${
                            syncMutation.isPending ? 'animate-spin' : ''
                          }`}
                        />
                        Sync Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDisconnect(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={disconnectMutation.isPending}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : provider.available && provider.connectUrl ? (
                  <a href={provider.connectUrl}>
                    <Button className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Connect {provider.name}
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>How CRM Integration Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Connect Your CRM</p>
              <p>
                Securely authorize RevSignal AI to access your CRM data using
                OAuth 2.0. We never store your CRM password.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Initial Sync</p>
              <p>
                We&apos;ll import your deals, accounts, and contacts. The initial
                sync typically takes a few minutes depending on data volume.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Continuous Updates</p>
              <p>
                RevSignal AI automatically syncs changes every 5 minutes to keep
                your data up-to-date and scores accurate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your CRM to start syncing deals and get AI-powered insights
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        }
      >
        <IntegrationsContent />
      </Suspense>
    </div>
  );
}
