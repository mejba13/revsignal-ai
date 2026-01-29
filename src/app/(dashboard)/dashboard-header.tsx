'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Menu,
  Bell,
  Search,
  Command,
  ChevronDown,
  Settings,
  User,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    organizationId: string;
    role: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030014]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          {/* Search bar */}
          <div className="hidden md:block">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-violet-400" />
              <input
                type="text"
                placeholder="Search deals, contacts..."
                className="h-10 w-72 rounded-xl border border-white/[0.06] bg-white/[0.04] pl-10 pr-16 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-white/[0.06] px-1.5 py-1 text-[10px] font-medium text-white/40">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* AI Status indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-400">AI Active</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/60 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0520]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="border-b border-white/[0.06] p-4">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* Notification items */}
                    {[
                      { title: 'Deal score updated', desc: 'Acme Corp score increased to 87', icon: Sparkles, color: 'violet' },
                      { title: 'At-risk alert', desc: 'TechStart Inc deal stalling', icon: Bell, color: 'amber' },
                      { title: 'New activity', desc: 'Email received from Sarah Chen', icon: User, color: 'cyan' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex cursor-pointer items-start gap-3 border-b border-white/[0.04] p-4 transition-colors hover:bg-white/[0.04]"
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${item.color}-500/20`}>
                          <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-white/50">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] p-3">
                    <button className="w-full text-center text-xs font-medium text-violet-400 hover:text-violet-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-white/[0.08]" />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-white/[0.04]"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
                  {initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#030014] bg-emerald-400" />
              </div>

              {/* User info */}
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-white">{user.name || user.email}</p>
                <p className="text-[10px] capitalize text-white/50">{user.role.toLowerCase()}</p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-white/40 sm:block" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0520]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="border-b border-white/[0.06] p-4">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {[
                      { label: 'Profile', icon: User, href: '#' },
                      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
                      { label: 'Help Center', icon: HelpCircle, href: '#' },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] p-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
