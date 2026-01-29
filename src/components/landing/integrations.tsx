'use client';

import { Check, Link2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const integrations = {
  crm: [
    { name: 'Salesforce', status: 'available' },
    { name: 'HubSpot', status: 'available' },
    { name: 'Pipedrive', status: 'coming' },
    { name: 'Zoho CRM', status: 'coming' },
    { name: 'Microsoft Dynamics', status: 'coming' },
  ],
  email: [
    { name: 'Gmail', status: 'available' },
    { name: 'Outlook', status: 'available' },
  ],
  meetings: [
    { name: 'Zoom', status: 'coming' },
    { name: 'Microsoft Teams', status: 'coming' },
    { name: 'Google Meet', status: 'coming' },
  ],
  communication: [
    { name: 'Slack', status: 'coming' },
  ],
};

const categories = [
  { key: 'crm', label: 'CRM Platforms', description: 'Connect your sales data' },
  { key: 'email', label: 'Email Providers', description: 'Track communications' },
  { key: 'meetings', label: 'Meeting Platforms', description: 'Capture insights' },
  { key: 'communication', label: 'Communication', description: 'Stay connected' },
];

export function Integrations() {
  return (
    <section id="integrations" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 opacity-20" />
        <div className="orb orb-cyan h-[500px] w-[500px] right-0 top-0" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="animate-in-up mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
              <Link2 className="h-4 w-4" />
              Native Integrations
            </span>
          </div>

          <h2 className="animate-in-up delay-1 mb-6 text-white">
            Connect your <span className="text-gradient">entire sales stack</span>
          </h2>

          <p className="animate-in-up delay-2 text-lg text-white/50">
            RevSignal AI integrates with your existing tools to capture every
            signal and provide complete visibility.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <div
              key={category.key}
              className="animate-in-up bento-card"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              {/* Header */}
              <div className="mb-6">
                <h3 className="mb-1 font-semibold text-white">{category.label}</h3>
                <p className="text-xs text-white/40">{category.description}</p>
              </div>

              {/* Integration List */}
              <ul className="space-y-3">
                {integrations[category.key as keyof typeof integrations].map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    {item.status === 'available' ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5" />
                    )}
                    <span
                      className={`text-sm ${
                        item.status === 'coming' ? 'text-white/40' : 'font-medium text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.status === 'coming' && (
                      <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                        Soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-in-up delay-7 mt-12 text-center">
          <p className="mb-4 text-white/40">
            Don&apos;t see your tool? We&apos;re adding new integrations every week.
          </p>
          <Link href="/contact">
            <Button className="btn-ghost group">
              Request an Integration
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
