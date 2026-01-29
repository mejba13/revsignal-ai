'use client';

import { trpc } from '@/lib/trpc';

/**
 * Hook to access tRPC client
 * Use this for all API calls in client components
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, isLoading } = useTRPC().users.me.useQuery();
 *   const { data: deals } = useTRPC().deals.list.useQuery({ page: 1 });
 *   const updateUser = useTRPC().users.update.useMutation();
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useTRPC() {
  return trpc;
}

/**
 * Export commonly used hooks directly
 */
export const useUser = () => trpc.users.me.useQuery();
export const useDashboard = () => trpc.dashboard.summary.useQuery();
export const useDeals = (input: Parameters<typeof trpc.deals.list.useQuery>[0]) =>
  trpc.deals.list.useQuery(input);
