'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Zap, ChevronRight } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      {/* Announcement Bar */}
      <div className="hidden md:block border-b border-white/5 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-9 items-center justify-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-violet-300">
              <Zap className="h-3.5 w-3.5" />
              <span className="font-medium">New:</span>
            </span>
            <span className="text-white/70">AI-Powered Revenue Forecasting is here</span>
            <Link href="#features" className="group inline-flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300">
              Learn more
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-violet-500/30 blur-lg transition-all group-hover:bg-violet-500/40 group-hover:blur-xl" />
            {/* Logo icon */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">RevSignal</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400">AI Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <span className="relative z-10">{link.label}</span>
              {/* Hover background */}
              <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="btn-cosmic rounded-full px-5">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-white/5 glass-strong transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full btn-cosmic">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
