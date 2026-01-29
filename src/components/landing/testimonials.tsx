'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'RevSignal AI transformed how we manage our pipeline. We now catch at-risk deals weeks earlier and our win rate improved by 28%.',
    author: 'Sarah Chen',
    title: 'VP of Sales',
    company: 'TechCorp',
    metric: '+28% win rate',
  },
  {
    quote:
      'The AI scoring is incredibly accurate. My reps finally know which deals to focus on, and our forecast accuracy improved dramatically.',
    author: 'Michael Rodriguez',
    title: 'Sales Director',
    company: 'GrowthCo',
    metric: '94% accuracy',
  },
  {
    quote:
      'Implementation was seamless. We connected Salesforce and started getting insights within hours. The ROI was clear within the first month.',
    author: 'Emily Johnson',
    title: 'RevOps Lead',
    company: 'ScaleUp Inc',
    metric: '3x ROI',
  },
];

const logos = ['TechCorp', 'GrowthCo', 'ScaleUp', 'DataFlow', 'CloudBase', 'SyncPro'];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="orb orb-cyan h-[500px] w-[500px] -left-64 top-1/2 -translate-y-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="animate-in-up mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              Customer Stories
            </span>
          </div>

          <h2 className="animate-in-up delay-1 mb-6 text-white">
            Loved by <span className="text-gradient">revenue teams</span>
          </h2>

          <p className="animate-in-up delay-2 text-lg text-white/50">
            See how sales leaders are using RevSignal AI to close more deals
            and grow revenue predictably.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="animate-in-up bento-card group"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -right-4 -top-4 text-white/5">
                <Quote className="h-24 w-24" />
              </div>

              {/* Metric Badge */}
              <span className="inline-flex mb-6 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
                {testimonial.metric}
              </span>

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="relative mb-6 text-white/70 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                  {testimonial.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-white/40">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo Cloud */}
        <div className="animate-in-up delay-6 mt-16 border-t border-white/5 pt-12">
          <p className="mb-8 text-center text-sm text-white/30">
            Trusted by leading revenue teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="text-xl font-bold text-white/20 transition-colors hover:text-white/40"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
