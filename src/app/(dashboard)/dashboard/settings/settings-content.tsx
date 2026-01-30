'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Sparkles,
  Camera,
  Calendar,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface SettingsContentProps {
  userName: string;
  userEmail: string;
}

// Custom toggle switch component
function ToggleSwitch({
  enabled,
  onChange,
  size = 'default',
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  size?: 'small' | 'default';
}) {
  const sizeClasses = size === 'small' ? 'h-5 w-9' : 'h-6 w-11';
  const dotSize = size === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const translateX = size === 'small' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${sizeClasses} shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-violet-500' : 'bg-white/10'
      }`}
    >
      <span
        className={`pointer-events-none inline-block ${dotSize} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? translateX : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

// Settings section card component
function SettingsCard({
  title,
  description,
  icon: Icon,
  gradient,
  children,
  className = '',
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all hover:border-violet-500/20 hover:bg-white/[0.03] ${className}`}
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative border-b border-white/[0.06] p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/40">{description}</p>
          </div>
        </div>
      </div>

      <div className="relative p-5">{children}</div>
    </div>
  );
}

// Settings row component
function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsContent({ userName, userEmail }: SettingsContentProps) {
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dealAlerts, setDealAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  const mockApiKey = 'rsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx';

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[500px] w-[500px] -right-48 -top-48 opacity-20" />
        <div className="orb orb-cyan h-[400px] w-[400px] -left-32 top-1/3 opacity-15" />
        <div className="orb orb-pink h-[300px] w-[300px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
              <User className="h-3 w-3" />
              Account Settings
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Settings</h1>
          <p className="mt-1 text-white/40">Manage your account preferences and configurations</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <SettingsCard
          title="Profile"
          description="Manage your personal information"
          icon={User}
          gradient="from-violet-500 to-violet-600"
          className="animate-in-up delay-1"
        >
          {/* Avatar Section */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-violet-500/25">
                {userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h4 className="font-semibold text-white">{userName}</h4>
              <p className="text-sm text-white/40">{userEmail}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <Check className="h-3 w-3" />
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1 divide-y divide-white/[0.06]">
            <SettingsRow label="Full Name" description="Your display name">
              <button className="text-sm text-violet-400 hover:text-violet-300">Edit</button>
            </SettingsRow>
            <SettingsRow label="Email Address" description={userEmail}>
              <button className="text-sm text-violet-400 hover:text-violet-300">Change</button>
            </SettingsRow>
            <SettingsRow label="Job Title" description="Sales Director">
              <button className="text-sm text-violet-400 hover:text-violet-300">Edit</button>
            </SettingsRow>
            <SettingsRow label="Time Zone" description="Pacific Time (PT)">
              <button className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                <Globe className="h-3.5 w-3.5" />
                Change
              </button>
            </SettingsRow>
          </div>
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard
          title="Notifications"
          description="Configure how you receive alerts"
          icon={Bell}
          gradient="from-cyan-500 to-cyan-600"
          className="animate-in-up delay-2"
        >
          <div className="space-y-1 divide-y divide-white/[0.06]">
            <SettingsRow label="Email Notifications" description="Receive updates via email">
              <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
            </SettingsRow>
            <SettingsRow label="Push Notifications" description="Browser push alerts">
              <ToggleSwitch enabled={pushNotifications} onChange={setPushNotifications} />
            </SettingsRow>
            <SettingsRow label="Deal Alerts" description="Get notified on deal changes">
              <ToggleSwitch enabled={dealAlerts} onChange={setDealAlerts} />
            </SettingsRow>
            <SettingsRow label="Risk Alerts" description="Immediate at-risk notifications">
              <ToggleSwitch enabled={riskAlerts} onChange={setRiskAlerts} />
            </SettingsRow>
            <SettingsRow label="Weekly Digest" description="Summary every Monday">
              <ToggleSwitch enabled={weeklyDigest} onChange={setWeeklyDigest} />
            </SettingsRow>
          </div>
        </SettingsCard>

        {/* Security Settings */}
        <SettingsCard
          title="Security"
          description="Protect your account"
          icon={Shield}
          gradient="from-emerald-500 to-emerald-600"
          className="animate-in-up delay-3"
        >
          <div className="space-y-4">
            {/* 2FA Section */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Key className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-white/40">Add an extra layer of security</p>
                  </div>
                </div>
                <ToggleSwitch enabled={twoFactorEnabled} onChange={setTwoFactorEnabled} />
              </div>
              {!twoFactorEnabled && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-amber-400">
                    Enable 2FA for enhanced account security
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1 divide-y divide-white/[0.06]">
              <SettingsRow label="Password" description="Last changed 30 days ago">
                <button className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                  <Lock className="h-3.5 w-3.5" />
                  Update
                </button>
              </SettingsRow>
              <SettingsRow label="Active Sessions" description="2 devices logged in">
                <button className="text-sm text-violet-400 hover:text-violet-300">Manage</button>
              </SettingsRow>
            </div>

            {/* API Key Section */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">API Key</p>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-white/40 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs text-white/60">
                  {showApiKey ? mockApiKey : '•'.repeat(32)}
                </code>
                <button className="rounded-lg bg-violet-500/20 px-3 py-2 text-xs font-medium text-violet-300 hover:bg-violet-500/30">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Appearance & Preferences */}
        <SettingsCard
          title="Preferences"
          description="Customize your experience"
          icon={Moon}
          gradient="from-pink-500 to-pink-600"
          className="animate-in-up delay-4"
        >
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-3 text-sm font-medium text-white">Theme</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all ${
                    darkMode
                      ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all ${
                    !darkMode
                      ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
              </div>
            </div>

            <div className="space-y-1 divide-y divide-white/[0.06]">
              <SettingsRow label="Language" description="English (US)">
                <button className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                  <Globe className="h-3.5 w-3.5" />
                  Change
                </button>
              </SettingsRow>
              <SettingsRow label="Date Format" description="MM/DD/YYYY">
                <button className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
                  <Calendar className="h-3.5 w-3.5" />
                  Change
                </button>
              </SettingsRow>
              <SettingsRow label="Currency" description="USD ($)">
                <button className="text-sm text-violet-400 hover:text-violet-300">Change</button>
              </SettingsRow>
            </div>
          </div>
        </SettingsCard>

        {/* Billing - Full Width */}
        <SettingsCard
          title="Billing & Plan"
          description="Manage your subscription"
          icon={CreditCard}
          gradient="from-amber-500 to-amber-600"
          className="animate-in-up delay-5 lg:col-span-2"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Plan */}
            <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <span className="font-semibold text-white">Pro Plan</span>
                </div>
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                  Active
                </span>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-white">
                  $99<span className="text-lg font-normal text-white/40">/month</span>
                </p>
                <p className="text-sm text-white/40">Billed monthly · Renews Feb 15, 2026</p>
              </div>

              <div className="space-y-2">
                {['Unlimited deal scoring', 'Advanced analytics', 'API access', 'Priority support'].map(
                  (feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white/60">
                      <Check className="h-4 w-4 text-emerald-400" />
                      {feature}
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-lg bg-violet-500/20 px-4 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/30">
                  Change Plan
                </button>
                <button className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5">
                  Cancel
                </button>
              </div>
            </div>

            {/* Payment Method & Usage */}
            <div className="space-y-4">
              {/* Payment Method */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Payment Method</p>
                  <button className="text-sm text-violet-400 hover:text-violet-300">Update</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-white/40">Expires 12/27</p>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-white">Current Usage</p>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-white/40">Deals Scored</span>
                      <span className="text-white">156 / 500</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        style={{ width: '31.2%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-white/40">Team Members</span>
                      <span className="text-white">4 / 10</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        style={{ width: '40%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-white/40">API Calls</span>
                      <span className="text-white">2,340 / 10,000</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: '23.4%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing History Link */}
              <Link
                href="#"
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                    <CreditCard className="h-4 w-4 text-white/60" />
                  </div>
                  <span className="text-sm text-white">View Billing History</span>
                </div>
                <ChevronRight className="h-4 w-4 text-white/40" />
              </Link>
            </div>
          </div>
        </SettingsCard>

        {/* Connected Integrations Quick Access */}
        <div className="animate-in-up delay-6 lg:col-span-2">
          <Link
            href="/dashboard/settings/integrations"
            className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">CRM Integrations</h3>
                <p className="text-sm text-white/40">
                  Connect Salesforce, HubSpot, and more to sync your deals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                2 Connected
              </span>
              <ChevronRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="animate-in-up delay-7 mt-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <h3 className="mb-1 font-semibold text-red-400">Danger Zone</h3>
          <p className="mb-4 text-sm text-white/40">
            Irreversible and destructive actions
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10">
              Export All Data
            </button>
            <button className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
