'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="orb orb-violet h-[600px] w-[600px] left-1/4 top-0" />
        <div className="orb orb-pink h-[500px] w-[500px] right-1/4 bottom-0" />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Main CTA Card */}
        <div className="animate-in-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-violet-800 p-8 md:p-16 shadow-2xl shadow-violet-500/20">
          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl" />

          {/* Floating Icons */}
          <div className="absolute left-10 top-10 float">
            <Sparkles className="h-8 w-8 text-white/20" />
          </div>
          <div className="absolute bottom-20 right-20 float-reverse">
            <Zap className="h-10 w-10 text-white/15" />
          </div>

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Start your 14-day free trial</span>
            </div>

            {/* Headline */}
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl xl:text-6xl">
              Ready to predict
              <br />
              your revenue?
            </h2>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 md:text-xl">
              Join hundreds of sales teams using RevSignal AI to close more deals
              and grow revenue predictably.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group h-14 bg-white px-8 text-base font-semibold text-violet-700 shadow-xl transition-all hover:bg-white/90 hover:shadow-2xl"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 border-white/30 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                No credit card required
              </span>
              <span className="hidden sm:inline">•</span>
              <span>14-day free trial</span>
              <span className="hidden sm:inline">•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="animate-in-up delay-2 mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: '500+', label: 'Revenue Teams' },
            { value: '$1.2B', label: 'Pipeline Managed' },
            { value: '94%', label: 'Accuracy Rate' },
            { value: '28%', label: 'Avg Win Rate Increase' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="mb-1 text-2xl font-bold text-gradient md:text-3xl">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
