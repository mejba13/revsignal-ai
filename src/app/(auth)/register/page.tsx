'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Check,
  TrendingUp,
  BarChart3,
  Target,
  Lock,
  Mail,
  User,
  Building2,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const passwordStrength = () => {
    const pass = formData.password;
    if (!pass) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-500'];
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const { strength, label: strengthLabel, color: strengthColor } = passwordStrength();

  const benefits = [
    { icon: Target, title: '94% Prediction Accuracy', desc: 'AI-powered deal scoring' },
    { icon: Clock, title: '3-4 Weeks Early Warning', desc: 'Detect risks before they happen' },
    { icon: TrendingUp, title: '3.2x Faster Cycles', desc: 'Close deals faster with insights' },
    { icon: Users, title: 'Team Collaboration', desc: 'Up to 10 users per organization' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-cosmic">
      {/* ===== COSMIC BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.2),transparent)]" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="orb orb-violet h-[700px] w-[700px] -left-64 -top-64 float-slow opacity-40" />
        <div className="orb orb-cyan h-[500px] w-[500px] -right-32 top-1/3 float opacity-40" />
        <div className="orb orb-pink h-[450px] w-[450px] left-1/4 -bottom-48 float-reverse opacity-30" />
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* ===== LEFT SIDE - BENTO SHOWCASE ===== */}
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-center px-8 xl:px-16 py-12">
          <div className={`space-y-6 ${mounted ? 'animate-in-up' : 'opacity-0'}`}>
            {/* Logo & Header */}
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RevSignal AI</span>
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
                <span className="text-white">Start predicting revenue</span>
                <br />
                <span className="text-gradient-animated">like never before</span>
              </h1>
              <p className="text-base text-white/60 max-w-lg">
                Join 500+ revenue teams using AI to close more deals. Free 14-day trial, no credit card required.
              </p>
            </div>

            {/* Bento Grid */}
            <div className={`grid grid-cols-2 gap-3 ${mounted ? 'animate-in-up delay-2' : 'opacity-0'}`}>
              {/* Main Dashboard Preview */}
              <div className="bento-card col-span-2 p-0 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-3 py-2">
                  <div className="flex gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="ml-3 flex-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/40">
                    app.revsignal.ai/dashboard
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Pipeline Intelligence</p>
                        <p className="text-[10px] text-white/40">Q1 2026 Overview</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-[10px] font-medium text-emerald-400">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Pipeline', value: '$2.4M', change: '+12%', positive: true },
                      { label: 'Win Rate', value: '34%', change: '+5%', positive: true },
                      { label: 'At Risk', value: '$340K', change: '8 deals', positive: false },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-lg bg-white/5 p-2 border border-white/5">
                        <p className="text-[9px] text-white/40 mb-0.5">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                        <p className={`text-[9px] flex items-center gap-0.5 ${stat.positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {stat.positive && <TrendingUp className="h-2.5 w-2.5" />}
                          {stat.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mini Deal List */}
                  <div className="space-y-1.5">
                    {[
                      { name: 'Acme Corp', score: 94, color: 'emerald' },
                      { name: 'TechStart Inc', score: 67, color: 'amber' },
                    ].map((deal, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-2 border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">
                            {deal.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-medium text-white">{deal.name}</span>
                        </div>
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          deal.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-amber-600'
                        }`}>
                          {deal.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits Cards */}
              {benefits.map((benefit, i) => (
                <div key={i} className={`bento-card p-4 ${mounted ? `animate-in-up delay-${i + 3}` : 'opacity-0'}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20">
                      <benefit.icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{benefit.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{benefit.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className={`flex items-center gap-4 pt-2 ${mounted ? 'animate-in-up delay-7' : 'opacity-0'}`}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 border-2 border-[#030014] flex items-center justify-center text-xs font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-white font-medium">500+ teams</span>
                <span className="text-white/40"> already using RevSignal AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE - REGISTER FORM ===== */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
          <div className={`w-full max-w-md ${mounted ? 'animate-scale-in delay-1' : 'opacity-0'}`}>
            {/* Mobile Logo */}
            <div className="mb-6 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">RevSignal AI</span>
              </Link>
            </div>

            {/* Register Card */}
            <div className="bento-card p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

              <div className="relative">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
                  <p className="text-white/50 text-sm">Start your 14-day free trial. No credit card required.</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        step >= s
                          ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      }`}>
                        {step > s ? <Check className="h-4 w-4" /> : s}
                      </div>
                      {s < 2 && (
                        <div className={`w-12 h-0.5 rounded ${step > 1 ? 'bg-violet-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName" className="text-white/70 text-sm font-medium">
                            First name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName" className="text-white/70 text-sm font-medium">
                            Last name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-white/70 text-sm font-medium">
                          Work email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          if (formData.firstName && formData.lastName && formData.email) {
                            setStep(2);
                          }
                        }}
                        className="btn-cosmic group h-11 w-full text-sm rounded-xl mt-2"
                      >
                        <span className="flex items-center gap-2">
                          Continue
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-white/70 text-sm font-medium">
                          Create password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="h-11 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 flex gap-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-all ${
                                    i <= strength ? strengthColor : 'bg-white/10'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-xs ${
                              strength >= 3 ? 'text-emerald-400' : strength >= 2 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {strengthLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-white/70 text-sm font-medium">
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                          />
                          {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="h-11 flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="btn-cosmic group h-11 flex-[2] text-sm rounded-xl"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Creating account...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Create account
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[rgba(15,10,40,0.5)] px-4 text-white/40">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <p className="mt-6 text-center text-sm text-white/50">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                    Sign in
                  </Link>
                </p>

                <p className="mt-4 text-center text-[11px] text-white/30 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-white/50 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline hover:text-white/50 transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className={`mt-5 flex items-center justify-center gap-4 text-[10px] text-white/30 ${mounted ? 'animate-in-up delay-4' : 'opacity-0'}`}>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-400/70" />
                256-bit SSL
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-violet-400/70" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-cyan-400/70" />
                GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
