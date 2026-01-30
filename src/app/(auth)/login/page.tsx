'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Lock,
  Mail,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setFormError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setFormError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  const stats = [
    { value: '94%', label: 'Accuracy', icon: Target },
    { value: '3.2x', label: 'Faster', icon: Zap },
    { value: '$2.4B', label: 'Managed', icon: BarChart3 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-cosmic">
      {/* ===== COSMIC BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.2),transparent)]" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="orb orb-violet h-[600px] w-[600px] -left-48 -top-48 float-slow opacity-50" />
        <div className="orb orb-cyan h-[500px] w-[500px] -right-32 top-1/4 float opacity-50" />
        <div className="orb orb-pink h-[400px] w-[400px] left-1/3 -bottom-32 float-reverse opacity-40" />
        <div className="bg-noise absolute inset-0" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* ===== LEFT SIDE - BRANDING & FEATURES ===== */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className={`space-y-8 ${mounted ? 'animate-in-up' : 'opacity-0'}`}>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">RevSignal AI</span>
            </Link>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                <span className="text-white">Welcome back to</span>
                <br />
                <span className="text-gradient-animated">Revenue Intelligence</span>
              </h1>
              <p className="text-lg text-white/60 max-w-md">
                Access your AI-powered dashboard to predict deal outcomes, detect risks, and close more revenue.
              </p>
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-3 gap-4 ${mounted ? 'animate-in-up delay-2' : 'opacity-0'}`}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bento-card p-4 text-center"
                >
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-violet-400" />
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Feature List */}
            <div className={`space-y-4 ${mounted ? 'animate-in-up delay-3' : 'opacity-0'}`}>
              {[
                { icon: TrendingUp, text: 'Real-time pipeline predictions' },
                { icon: Shield, text: 'Enterprise-grade security' },
                { icon: BarChart3, text: 'AI-powered deal scoring' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <feature.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <span className="text-white/70">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE - LOGIN FORM ===== */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className={`w-full max-w-md ${mounted ? 'animate-scale-in delay-1' : 'opacity-0'}`}>
            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">RevSignal AI</span>
              </Link>
            </div>

            {/* Login Card */}
            <div className="bento-card p-8 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

              <div className="relative">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Sign in to your account</h2>
                  <p className="text-white/50">Enter your credentials to continue</p>
                </div>

                {(error || formError) && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    <Shield className="h-5 w-5 flex-shrink-0" />
                    <span>{formError || 'An error occurred during sign in'}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70 text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white/70 text-sm font-medium">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-cosmic group h-12 w-full text-base rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign in
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="relative my-8">
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
                  className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <p className="mt-8 text-center text-sm text-white/50">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Create free account
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className={`mt-6 flex items-center justify-center gap-6 text-xs text-white/30 ${mounted ? 'animate-in-up delay-4' : 'opacity-0'}`}>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400/70" />
                256-bit SSL
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-violet-400/70" />
                SOC 2 Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cosmic">
          <div className="flex items-center gap-3 text-white/50">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
