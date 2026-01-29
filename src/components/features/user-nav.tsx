'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium">{session.user.name}</p>
        <p className="text-xs text-muted-foreground">{session.user.email}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </Button>
    </div>
  );
}
