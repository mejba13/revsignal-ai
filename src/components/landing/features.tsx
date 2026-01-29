'use client';

import { Target, Bell, TrendingUp, Lightbulb, Sparkles, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI Deal Scoring',
    description: 'Every deal gets a real-time 0-100 score based on 50+ signals. Know exactly which opportunities deserve your attention.',
    metric: '94%',
    metricLabel: 'Accuracy',
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/30',
  },
  {
    icon: Bell,
    title: 'Risk Detection',
    description: 'Detect at-risk deals 3-4 weeks earlier than traditional methods. Never be blindsided by a deal going cold.',
    metric: '3-4',
    metricLabel: 'Weeks Early',
    color: 'rose',
    gradient: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Forecasting',
    description: 'AI-powered forecasts with confidence intervals. Know your commit, best case, and pipeline with precision.',
    metric: '<10%',
    metricLabel: 'Variance',
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/30',
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description: 'Context-aware action recommendations for every deal. Know exactly what to do and when to do it.',
    metric: '23%',
    metricLabel: 'Win Rate Increase',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/30',
  },
];

export function Features() {
  return (
    <section id="features" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="orb orb-violet h-[600px] w-[600px] left-1/2 -translate-x-1/2 -top-64" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="animate-in-up mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              <Sparkles className="h-4 w-4" />
              Platform Features
            </span>
          </div>

          <h2 className="animate-in-up delay-1 mb-6 text-white">
            Everything you need to{' '}
            <span className="text-gradient">win more deals</span>
          </h2>

          <p className="animate-in-up delay-2 text-lg text-white/50">
            RevSignal analyzes every signal to give you unprecedented visibility
            into deal health and revenue predictability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className="animate-in-up bento-card group"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              {/* Icon */}
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.glow}`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mb-6 text-white/50 leading-relaxed">{feature.description}</p>

              {/* Metric */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-gradient">{feature.metric}</p>
                  <p className="text-sm text-white/40">{feature.metricLabel}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 opacity-0 transition-all group-hover:opacity-100 group-hover:bg-white/10">
                  <ArrowUpRight className="h-5 w-5 text-white/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
