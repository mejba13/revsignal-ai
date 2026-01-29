'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers';

/**
 * tRPC React hooks
 */
export const trpc = createTRPCReact<AppRouter>();
