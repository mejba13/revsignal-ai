'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden">
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{user.name || user.email}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {(user.name || user.email || 'U')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
