'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTRPC } from '@/hooks/use-trpc';
import {
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Plug,
  Sparkles,
  Cloud,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';

const CRM_PROVIDERS = [
  {
    id: 'SALESFORCE',
    name: 'Salesforce',
    description: 'Sync deals, accounts, and contacts from Salesforce CRM',
    icon: Cloud,
    connectUrl: '/api/integrations/salesforce',
    available: true,
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/25',
  },
  {
    id: 'HUBSPOT',
    name: 'HubSpot',
    description: 'Sync deals, companies, and contacts from HubSpot CRM',
    icon: Zap,
    connectUrl: '/api/integrations/hubspot',
    available: true,
    gradient: 'from-orange-500 to-orange-600',
    glow: 'shadow-orange-500/25',
  },
  {
    id: 'PIPEDRIVE',
    name: 'Pipedrive',
    description: 'Sync deals, organizations, and contacts from Pipedrive',
    icon: Zap,
    connectUrl: null,
    available: false,
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/25',
  },
  {
    id: 'ZOHO',
    name: 'Zoho CRM',
    description: 'Sync deals, accounts, and contacts from Zoho CRM',
    icon: Zap,
    connectUrl: null,
    available: false,
    gradient: 'from-red-500 to-red-600',
    glow: 'shadow-red-500/25',
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
        <div className="animate-in-up flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
            <Check className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-sm text-emerald-400">{decodeURIComponent(success)}</span>
        </div>
      )}

      {error && (
        <div className="animate-in-up flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
            <X className="h-4 w-4 text-red-400" />
          </div>
          <span className="text-sm text-red-400">{decodeURIComponent(error)}</span>
        </div>
      )}

      {/* CRM Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {CRM_PROVIDERS.map((provider, index) => {
          const integration = getIntegrationStatus(provider.id);
          const isConnected = integration?.status === 'CONNECTED';
          const isSyncing = integration?.status === 'SYNCING';
          const Icon = provider.icon;

          return (
            <div
              key={provider.id}
              className={`animate-in-up overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all hover:border-white/[0.1] hover:bg-white/[0.03]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${provider.gradient} shadow-lg ${provider.glow}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{provider.name}</h3>
                      <p className="text-xs text-white/40">{provider.description}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isConnected && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Connected
                    </span>
                  )}
                  {isSyncing && (
                    <span className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Syncing
                    </span>
                  )}
                  {!provider.available && (
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/40">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="border-t border-white/[0.06] p-5">
                {isLoading ? (
                  <div className="h-10 animate-pulse rounded-lg bg-white/[0.06]" />
                ) : isConnected ? (
                  <div className="space-y-4">
                    {integration?.lastSyncAt && (
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                      </div>
                    )}
                    {integration?.syncError && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-400">
                        <X className="h-3.5 w-3.5" />
                        {integration.syncError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={isSyncing || syncMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                      <button
                        onClick={() => handleDisconnect(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={disconnectMutation.isPending}
                        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : provider.available && provider.connectUrl ? (
                  <a href={provider.connectUrl}>
                    <button className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${provider.gradient} px-4 py-3 text-sm font-medium text-white shadow-lg ${provider.glow} transition-all hover:opacity-90`}>
                      <ExternalLink className="h-4 w-4" />
                      Connect {provider.name}
                    </button>
                  </a>
                ) : (
                  <button disabled className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-medium text-white/30">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works Card */}
      <div className="animate-in-up delay-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="border-b border-white/[0.06] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">How CRM Integration Works</h3>
              <p className="text-xs text-white/40">Simple 3-step process</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {[
            {
              step: 1,
              title: 'Connect Your CRM',
              desc: 'Securely authorize RevSignal AI to access your CRM data using OAuth 2.0. We never store your CRM password.',
            },
            {
              step: 2,
              title: 'Initial Sync',
              desc: "We'll import your deals, accounts, and contacts. The initial sync typically takes a few minutes depending on data volume.",
            },
            {
              step: 3,
              title: 'Continuous Updates',
              desc: 'RevSignal AI automatically syncs changes every 5 minutes to keep your data up-to-date and scores accurate.',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
                {item.step}
              </div>
              <div>
                <h4 className="font-medium text-white">{item.title}</h4>
                <p className="mt-1 text-sm text-white/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
            <Plug className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">Integrations</h1>
            <p className="text-sm text-white/40">
              Connect your CRM to start syncing deals and get AI-powered insights
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        }
      >
        <IntegrationsContent />
      </Suspense>
    </div>
  );
}
