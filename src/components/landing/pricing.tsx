'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'For small sales teams getting started with AI',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Up to 10 users',
      'AI deal scoring',
      'Risk detection alerts',
      '2 CRM integrations',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams that need advanced intelligence',
    monthlyPrice: 199,
    annualPrice: 159,
    features: [
      'Up to 50 users',
      'Everything in Starter',
      'Advanced AI forecasting',
      'All integrations',
      'Priority support',
      'Custom dashboards',
      'API access',
      'Team analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: null,
    annualPrice: null,
    features: [
      'Unlimited users',
      'Everything in Professional',
      'Custom ML models',
      'SSO/SAML authentication',
      'Dedicated CSM',
      'SLA guarantee',
      'On-premise option',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="orb orb-violet h-[600px] w-[600px] left-0 top-1/4" />
        <div className="orb orb-pink h-[400px] w-[400px] right-0 bottom-0" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="animate-in-up mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              <Zap className="h-4 w-4" />
              Simple Pricing
            </span>
          </div>

          <h2 className="animate-in-up delay-1 mb-6 text-white">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>

          <p className="animate-in-up delay-2 text-lg text-white/50">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="animate-in-up delay-3 mt-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                !annual
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                annual
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Annual
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`animate-in-up bento-card ${
                plan.highlighted
                  ? 'border-violet-500/30 ring-1 ring-violet-500/20'
                  : ''
              }`}
              style={{ animationDelay: `${(i + 4) * 100}ms` }}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-b-lg bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-1.5 shadow-lg shadow-violet-500/30">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="mb-2 text-xl font-bold text-white">{plan.name}</h3>
              <p className="mb-6 text-sm text-white/50">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.monthlyPrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-white/40">/user/mo</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">Custom</div>
                )}
                {plan.monthlyPrice && annual && (
                  <p className="mt-1 text-sm text-white/40">Billed annually</p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      plan.highlighted ? 'bg-violet-500/20' : 'bg-white/10'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        plan.highlighted ? 'text-violet-400' : 'text-white/50'
                      }`} />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                <Button
                  className={`w-full ${plan.highlighted ? 'btn-cosmic' : 'btn-ghost'}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="animate-in-up delay-7 mt-16 text-center">
          <p className="text-white/40">
            Have questions?{' '}
            <Link href="/contact" className="font-medium text-violet-400 hover:text-violet-300">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
