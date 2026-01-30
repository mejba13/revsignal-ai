'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Play,
  Check,
  TrendingUp,
  Target,
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

// Background video - Abstract digital network/data visualization
// Creates a premium tech feel that resonates with AI/Revenue Intelligence theme
const BACKGROUND_VIDEOS = [
  // Primary: Abstract blue/purple tech particles - evokes AI, data, intelligence
  'https://cdn.pixabay.com/video/2021/02/15/65578-512978498_large.mp4',
  // Fallback: Digital network connections
  'https://cdn.pixabay.com/video/2020/07/30/45949-446153770_large.mp4',
];

const stats = [
  { value: '94%', label: 'Prediction Accuracy', icon: Target },
  { value: '3.2x', label: 'Faster Deal Cycles', icon: Zap },
  { value: '$2.4B', label: 'Pipeline Managed', icon: BarChart3 },
  { value: '500+', label: 'Revenue Teams', icon: Users },
];

const trustedBy = [
  'Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Webflow', 'Loom', 'Retool',
  'Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Webflow', 'Loom', 'Retool',
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount with fallback handling
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented, try with user interaction or just show poster
        console.log('Video autoplay was prevented');
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-cosmic">
      {/* ===== VIDEO BACKGROUND ===== */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover scale-110"
          style={{
            transform: 'translate(-50%, -50%)',
            filter: 'hue-rotate(-10deg) saturate(1.2)',
          }}
        >
          <source src={BACKGROUND_VIDEOS[0]} type="video/mp4" />
          <source src={BACKGROUND_VIDEOS[1]} type="video/mp4" />
        </video>
      </div>

      {/* ===== VIDEO OVERLAY - Creates the cosmic purple tint and ensures text readability ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118]/80 via-[#0a0118]/70 to-[#0a0118]/90" />
        {/* Purple/violet color tint for brand consistency */}
        <div className="absolute inset-0 bg-violet-950/40 mix-blend-multiply" />
        {/* Extra darkness at edges for vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,1,24,0.6)_100%)]" />
      </div>

      {/* ===== COSMIC BACKGROUND EFFECTS (on top of video) ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.2),transparent)]" />

        {/* Grid pattern */}
        <div className="bg-grid absolute inset-0 opacity-20" />

        {/* Animated orbs - reduced opacity to blend with video */}
        <div className="orb orb-violet h-[600px] w-[600px] -left-48 -top-48 float-slow opacity-40" />
        <div className="orb orb-cyan h-[500px] w-[500px] -right-32 top-1/4 float opacity-40" />
        <div className="orb orb-pink h-[400px] w-[400px] left-1/3 -bottom-32 float-reverse opacity-40" />

        {/* Noise texture */}
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-36 md:pt-44 lg:pt-48">
        {/* ===== HERO HEADER ===== */}
        <div className="mx-auto max-w-4xl text-center mb-16 lg:mb-20">
          {/* Announcement Badge */}
          <div className="animate-in-down mb-8 inline-flex">
            <Link
              href="#features"
              className="group inline-flex items-center gap-3 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-violet-500/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              <span>Introducing AI Revenue Intelligence</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Main Headline */}
          <h1 className="animate-in-up delay-1 mb-8">
            <span className="block text-white">Turn Your CRM Into a</span>
            <span className="text-gradient-animated block mt-2">Revenue Prediction Engine</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-in-up delay-2 mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl leading-relaxed">
            RevSignal AI analyzes every deal signal to predict outcomes, detect risks 3-4 weeks early,
            and recommend winning actions. Stop guessing. Start closing.
          </p>

          {/* CTA Buttons */}
          <div className="animate-in-up delay-3 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="btn-cosmic group h-14 w-full px-8 text-base sm:w-auto rounded-full">
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="btn-ghost h-14 w-full gap-2 px-8 text-base sm:w-auto rounded-full text-white"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="animate-in-up delay-4 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Setup in 5 minutes
            </span>
          </div>
        </div>

        {/* ===== BENTO GRID DASHBOARD ===== */}
        <div className="animate-in-up delay-5 relative mx-auto max-w-6xl">
          {/* Glow behind the grid */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl" />

          <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
            {/* ===== MAIN DASHBOARD CARD (Large) ===== */}
            <div className="bento-card lg:col-span-7 lg:row-span-2 p-0 overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/40">
                  app.revsignal.ai/dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Pipeline Intelligence</h3>
                      <p className="text-xs text-white/40">Q1 2026 Overview</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-xs font-medium text-emerald-400">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pipeline Value', value: '$2.4M', change: '+12%', positive: true },
                    { label: 'Win Rate', value: '34%', change: '+5%', positive: true },
                    { label: 'At Risk', value: '$340K', change: '8 deals', positive: false },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl bg-white/5 p-3 border border-white/5">
                      <p className="text-[11px] text-white/40 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className={`text-[10px] mt-1 flex items-center gap-1 ${stat.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {stat.positive && <TrendingUp className="h-3 w-3" />}
                        {stat.change}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Deal List */}
                <div className="space-y-2">
                  {[
                    { name: 'Acme Corp', amount: '$125,000', score: 94, stage: 'Negotiation' },
                    { name: 'TechStart Inc', amount: '$89,000', score: 67, stage: 'Proposal' },
                    { name: 'Global Systems', amount: '$210,000', score: 42, stage: 'Discovery' },
                  ].map((deal, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-violet-500/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white/70">
                          {deal.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{deal.name}</p>
                          <p className="text-xs text-white/40">{deal.amount} · {deal.stage}</p>
                        </div>
                      </div>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                          deal.score >= 80
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                            : deal.score >= 60
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30'
                            : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                        }`}
                      >
                        {deal.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== AI SCORE CARD ===== */}
            <div className="bento-card lg:col-span-5 p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Deal Score</h3>
                  <p className="text-xs text-white/40">Real-time prediction</p>
                </div>
              </div>

              {/* Score Ring */}
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle
                      cx="64" cy="64" r="56"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray="352"
                      strokeDashoffset="35"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">87</div>
                    <div className="text-xs text-white/40 mt-1">Score</div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-white/40">
                <span className="text-emerald-400 font-medium">High probability</span> to close this quarter
              </div>
            </div>

            {/* ===== AI INSIGHT CARD ===== */}
            <div className="bento-card lg:col-span-5 p-5 border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-violet-400">AI Recommendation</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                <strong className="text-white">Schedule follow-up with Sarah Chen at Acme Corp</strong> —
                engagement dropped 40% this week. Historical data shows 73% recovery rate when contacted within 48 hours.
              </p>
              <Button size="sm" className="w-full bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30">
                Take Action
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* ===== FLOATING NOTIFICATION CARDS ===== */}
          <div className="absolute -left-6 top-1/4 hidden lg:block float">
            <div className="glass rounded-xl p-4 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Deal Won!</p>
                  <p className="text-xs text-white/40">+$125,000 ARR</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-6 bottom-1/3 hidden lg:block float-reverse">
            <div className="glass rounded-xl p-4 shadow-2xl shadow-violet-500/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">New Prediction</p>
                  <p className="text-xs text-white/40">Q1 forecast updated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS SECTION ===== */}
        <div className="animate-in-up delay-6 mt-24 mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="group text-center">
                <div className="mb-3 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
                  <stat.icon className="h-5 w-5 text-violet-400" />
                </div>
                <p className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TRUSTED BY MARQUEE ===== */}
        <div className="animate-in-up delay-7 mt-20">
          <p className="mb-8 text-center text-sm text-white/30">
            Trusted by revenue teams at leading companies
          </p>
          <div className="marquee-container">
            <div className="marquee gap-16">
              {trustedBy.map((name, i) => (
                <span
                  key={i}
                  className="text-xl font-semibold text-white/20 whitespace-nowrap transition-colors hover:text-white/40"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
