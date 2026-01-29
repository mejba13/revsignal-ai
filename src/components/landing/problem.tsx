'use client';

import { X, Check, ArrowDown, Zap } from 'lucide-react';

const problems = [
  'Deals slip through the cracks',
  'Forecasts are unreliable guesswork',
  'No visibility into deal health',
  'Reps waste time on bad deals',
];

const solutions = [
  'AI scores every deal automatically',
  'Predictive forecasts with 94% accuracy',
  'Real-time risk alerts and insights',
  'Focus reps on highest-potential deals',
];

export function Problem() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="animate-in-up mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
              The Problem
            </span>
          </div>

          <h2 className="animate-in-up delay-1 mb-6 text-white">
            Your CRM is a <span className="text-red-400">data graveyard</span>
          </h2>

          <p className="animate-in-up delay-2 text-lg text-white/50">
            Most revenue teams are flying blind. Deals die silently, forecasts miss the mark,
            and reps spend hours on opportunities that will never close.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Without RevSignal */}
          <div className="animate-in-up delay-3 bento-card border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <X className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Without RevSignal</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <span className="text-white/60">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With RevSignal */}
          <div className="animate-in-up delay-4 bento-card border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Check className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">With RevSignal</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-white">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Solution Transition */}
        <div className="mt-16">
          <div className="mb-8 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 border border-violet-500/30">
              <ArrowDown className="h-6 w-6 text-violet-400" />
            </div>
          </div>

          <div className="animate-in-up delay-5 bento-card border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 p-8 md:p-12">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
                <Zap className="h-8 w-8 text-white" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                RevSignal transforms your CRM into a{' '}
                <span className="text-gradient">predictive intelligence layer</span>
              </h3>

              <p className="max-w-2xl text-white/50">
                Stop reacting to lost deals. Start predicting outcomes, detecting risks early,
                and taking action when it matters most.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-16">
                {[
                  { value: '3-4 weeks', label: 'Earlier risk detection' },
                  { value: '94%', label: 'Prediction accuracy' },
                  { value: '28%', label: 'Win rate improvement' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-gradient md:text-3xl">{stat.value}</div>
                    <div className="text-sm text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
