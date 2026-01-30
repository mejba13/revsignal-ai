'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
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
  Shield,
  Lock,
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Settings,
  Globe,
} from 'lucide-react';

// CRM Provider configuration
const CRM_PROVIDERS = [
  {
    id: 'SALESFORCE',
    name: 'Salesforce',
    description: 'Sync deals, accounts, and contacts from Salesforce CRM',
    longDescription: 'Connect your Salesforce instance to automatically import opportunities, accounts, contacts, and activities.',
    icon: Cloud,
    connectUrl: '/api/integrations/salesforce',
    available: true,
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/25',
    bgGlow: 'bg-blue-500/20',
    features: ['Real-time sync', 'Opportunity tracking', 'Contact import'],
  },
  {
    id: 'HUBSPOT',
    name: 'HubSpot',
    description: 'Sync deals, companies, and contacts from HubSpot CRM',
    longDescription: 'Integrate HubSpot to sync deals, companies, contacts, and engagement data automatically.',
    icon: Zap,
    connectUrl: '/api/integrations/hubspot',
    available: true,
    gradient: 'from-orange-500 to-orange-600',
    glow: 'shadow-orange-500/25',
    bgGlow: 'bg-orange-500/20',
    features: ['Deal pipeline sync', 'Company records', 'Contact history'],
  },
  {
    id: 'PIPEDRIVE',
    name: 'Pipedrive',
    description: 'Sync deals, organizations, and contacts from Pipedrive',
    longDescription: 'Coming soon: Connect Pipedrive to sync deals, organizations, and contact information.',
    icon: Activity,
    connectUrl: null,
    available: false,
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/25',
    bgGlow: 'bg-emerald-500/20',
    features: ['Deal sync', 'Organization import', 'Activity tracking'],
  },
  {
    id: 'ZOHO',
    name: 'Zoho CRM',
    description: 'Sync deals, accounts, and contacts from Zoho CRM',
    longDescription: 'Coming soon: Integrate Zoho CRM to import deals, accounts, and contact records.',
    icon: Globe,
    connectUrl: null,
    available: false,
    gradient: 'from-red-500 to-red-600',
    glow: 'shadow-red-500/25',
    bgGlow: 'bg-red-500/20',
    features: ['Deal tracking', 'Account sync', 'Contact management'],
  },
] as const;

// Stat card component
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  glow,
  delay,
}: {
  label: string;
  value: string | number;
  icon: typeof Database;
  gradient: string;
  glow: string;
  delay: number;
}) {
  return (
    <div
      className="animate-in-up group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${glow} blur-3xl opacity-0 transition-opacity group-hover:opacity-100`} />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/40">{label}</p>
      </div>
    </div>
  );
}

// Integration step component
function IntegrationStep({
  step,
  title,
  description,
  icon: Icon,
  gradient,
  active,
  delay,
}: {
  step: number;
  title: string;
  description: string;
  icon: typeof Lock;
  gradient: string;
  active: boolean;
  delay: number;
}) {
  return (
    <div
      className={`animate-in-up flex items-start gap-4 rounded-xl border p-5 transition-all ${
        active
          ? 'border-violet-500/30 bg-violet-500/5'
          : 'border-white/[0.04] bg-white/[0.02]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-violet-400">Step {step}</span>
        </div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="mt-1 text-sm text-white/40">{description}</p>
      </div>
    </div>
  );
}

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

  const connectedCount = integrations?.filter(i => i.status === 'CONNECTED').length ?? 0;
  const syncingCount = integrations?.filter(i => i.status === 'SYNCING').length ?? 0;

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-cyan h-[600px] w-[600px] -right-64 -top-64 opacity-20" />
        <div className="orb orb-violet h-[500px] w-[500px] -left-48 top-1/3 opacity-15" />
        <div className="orb orb-pink h-[400px] w-[400px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              <Plug className="h-3 w-3" />
              CRM Integrations
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Integrations</h1>
          <p className="mt-1 text-white/40">Connect your CRM to start syncing deals and get AI-powered insights</p>
        </div>

        <div className="animate-in-up delay-1 flex flex-wrap items-center gap-3">
          {/* Connected indicator */}
          {connectedCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-emerald-400">
                {connectedCount} Connected
              </span>
            </div>
          )}

          {/* Syncing indicator */}
          {syncingCount > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
              <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
              <span className="text-sm font-medium text-violet-400">Syncing</span>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="animate-in-up mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <Check className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-emerald-400">Success!</p>
            <p className="text-sm text-emerald-400/70">{decodeURIComponent(success)}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="animate-in-up mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="font-medium text-red-400">Error</p>
            <p className="text-sm text-red-400/70">{decodeURIComponent(error)}</p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="relative mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Available CRMs"
          value="4"
          icon={Globe}
          gradient="from-violet-500 to-violet-600"
          glow="bg-violet-500/20"
          delay={200}
        />
        <StatCard
          label="Connected"
          value={isLoading ? '--' : connectedCount}
          icon={CheckCircle}
          gradient="from-emerald-500 to-emerald-600"
          glow="bg-emerald-500/20"
          delay={300}
        />
        <StatCard
          label="Data Sources"
          value={isLoading ? '--' : connectedCount > 0 ? 'Active' : 'None'}
          icon={Database}
          gradient="from-cyan-500 to-cyan-600"
          glow="bg-cyan-500/20"
          delay={400}
        />
        <StatCard
          label="Sync Status"
          value={syncingCount > 0 ? 'Syncing' : connectedCount > 0 ? 'Ready' : 'Pending'}
          icon={RefreshCw}
          gradient="from-pink-500 to-pink-600"
          glow="bg-pink-500/20"
          delay={500}
        />
      </div>

      {/* CRM Integrations Grid */}
      <div className="relative mb-8 grid gap-4 md:grid-cols-2">
        {CRM_PROVIDERS.map((provider, index) => {
          const integration = getIntegrationStatus(provider.id);
          const isConnected = integration?.status === 'CONNECTED';
          const isSyncing = integration?.status === 'SYNCING';
          const Icon = provider.icon;

          return (
            <div
              key={provider.id}
              className={`animate-in-up group overflow-hidden rounded-2xl border backdrop-blur-sm transition-all ${
                isConnected
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]'
              }`}
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${provider.gradient} shadow-lg ${provider.glow} transition-transform group-hover:scale-105`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      <p className="text-sm text-white/40">{provider.description}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isConnected && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Connected
                    </span>
                  )}
                  {isSyncing && (
                    <span className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Syncing
                    </span>
                  )}
                  {!provider.available && (
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/40">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-white/50"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/[0.06] p-6">
                {isLoading ? (
                  <div className="h-12 animate-pulse rounded-xl bg-white/[0.06]" />
                ) : isConnected ? (
                  <div className="space-y-4">
                    {integration?.lastSyncAt && (
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                      </div>
                    )}
                    {integration?.syncError && (
                      <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{integration.syncError}</span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSync(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={isSyncing || syncMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                      <button
                        onClick={() => handleDisconnect(provider.id as 'SALESFORCE' | 'HUBSPOT')}
                        disabled={disconnectMutation.isPending}
                        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : provider.available && provider.connectUrl ? (
                  <a href={provider.connectUrl} className="block">
                    <button className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${provider.gradient} px-4 py-3.5 text-sm font-medium text-white shadow-lg ${provider.glow} transition-all hover:opacity-90 hover:shadow-xl`}>
                      <ExternalLink className="h-4 w-4" />
                      Connect {provider.name}
                    </button>
                  </a>
                ) : (
                  <button disabled className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-sm font-medium text-white/30">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works Section */}
      <div className="relative grid gap-6 lg:grid-cols-12">
        {/* Integration Process */}
        <div className="animate-in-up delay-10 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">How CRM Integration Works</h3>
                  <p className="text-sm text-white/40">Simple 3-step process to get started</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <IntegrationStep
                step={1}
                title="Connect Your CRM"
                description="Securely authorize RevSignal AI to access your CRM data using OAuth 2.0. We never store your CRM password."
                icon={Lock}
                gradient="from-violet-500 to-violet-600"
                active={connectedCount === 0}
                delay={1100}
              />
              <IntegrationStep
                step={2}
                title="Initial Data Sync"
                description="We'll import your deals, accounts, and contacts. The initial sync typically takes a few minutes depending on data volume."
                icon={Database}
                gradient="from-cyan-500 to-cyan-600"
                active={syncingCount > 0}
                delay={1150}
              />
              <IntegrationStep
                step={3}
                title="Continuous Updates"
                description="RevSignal AI automatically syncs changes every 5 minutes to keep your data up-to-date and AI scores accurate."
                icon={RefreshCw}
                gradient="from-pink-500 to-pink-600"
                active={connectedCount > 0 && syncingCount === 0}
                delay={1200}
              />
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="animate-in-up delay-11 lg:col-span-5">
          <div className="h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Security & Privacy</h3>
                  <p className="text-xs text-white/40">Your data is protected</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Lock className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">OAuth 2.0 Authentication</h4>
                  <p className="text-xs text-white/40">Secure industry-standard authentication</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Shield className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Encrypted Data Transfer</h4>
                  <p className="text-xs text-white/40">All data encrypted in transit and at rest</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Database className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Read-Only Access</h4>
                  <p className="text-xs text-white/40">We only read your CRM data, never modify it</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">SOC 2 Compliant</h4>
                  <p className="text-xs text-white/40">Enterprise-grade security standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="animate-in-up delay-12 lg:col-span-12">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Need help with integrations?</p>
                  <p className="text-xs text-white/40">Contact support or view documentation</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/deals"
                  className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Deals
                </Link>
                <Link
                  href="/dashboard/ai"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Scoring
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

export default function IntegrationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 lg:p-8">
          <div className="mb-8 h-12 w-64 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        </div>
      }
    >
      <IntegrationsContent />
    </Suspense>
  );
}
