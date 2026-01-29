import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { syncSalesforce } from '@/lib/integrations/salesforce-client';
import { syncHubSpot } from '@/lib/integrations/hubspot-client';

export const integrationsRouter = router({
  /**
   * List all integrations for the organization
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const integrations = await ctx.db.integration.findMany({
      where: {
        organizationId: ctx.user.organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        provider: true,
        status: true,
        lastSyncAt: true,
        syncError: true,
        createdAt: true,
      },
    });

    return integrations;
  }),

  /**
   * Get integration status
   */
  status: protectedProcedure
    .input(z.object({ provider: z.enum(['SALESFORCE', 'HUBSPOT', 'PIPEDRIVE', 'ZOHO']) }))
    .query(async ({ ctx, input }) => {
      const integration = await ctx.db.integration.findFirst({
        where: {
          organizationId: ctx.user.organizationId,
          provider: input.provider,
          deletedAt: null,
        },
        select: {
          id: true,
          provider: true,
          status: true,
          lastSyncAt: true,
          syncError: true,
          settings: true,
        },
      });

      if (!integration) {
        return {
          connected: false,
          provider: input.provider,
        };
      }

      return {
        connected: integration.status === 'CONNECTED',
        id: integration.id,
        provider: integration.provider,
        status: integration.status,
        lastSyncAt: integration.lastSyncAt,
        syncError: integration.syncError,
        settings: integration.settings,
      };
    }),

  /**
   * Disconnect an integration (admin only)
   */
  disconnect: adminProcedure
    .input(z.object({ provider: z.enum(['SALESFORCE', 'HUBSPOT', 'PIPEDRIVE', 'ZOHO']) }))
    .mutation(async ({ ctx, input }) => {
      const integration = await ctx.db.integration.updateMany({
        where: {
          organizationId: ctx.user.organizationId,
          provider: input.provider,
          deletedAt: null,
        },
        data: {
          status: 'DISCONNECTED',
          accessToken: '',
          refreshToken: null,
          deletedAt: new Date(),
        },
      });

      if (integration.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Integration not found',
        });
      }

      return { success: true };
    }),

  /**
   * Trigger a manual sync
   */
  sync: adminProcedure
    .input(z.object({ provider: z.enum(['SALESFORCE', 'HUBSPOT', 'PIPEDRIVE', 'ZOHO']) }))
    .mutation(async ({ ctx, input }) => {
      const integration = await ctx.db.integration.findFirst({
        where: {
          organizationId: ctx.user.organizationId,
          provider: input.provider,
          status: 'CONNECTED',
          deletedAt: null,
        },
      });

      if (!integration) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Integration not found or not connected',
        });
      }

      // Update status to syncing
      await ctx.db.integration.update({
        where: { id: integration.id },
        data: { status: 'SYNCING' },
      });

      try {
        // Run sync based on provider
        let result: { accounts: number; contacts: number; deals: number; errors: string[] };

        if (input.provider === 'SALESFORCE') {
          result = await syncSalesforce(integration.id);
        } else if (input.provider === 'HUBSPOT') {
          result = await syncHubSpot(integration.id);
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Sync not implemented for ${input.provider}`,
          });
        }

        return {
          status: 'COMPLETED',
          message: 'Sync completed successfully',
          accounts: result.accounts,
          contacts: result.contacts,
          deals: result.deals,
          errors: result.errors,
        };
      } catch (error) {
        // Status will be updated by the sync function
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Sync failed',
        });
      }
    }),

  /**
   * Get sync logs for an integration
   */
  logs: protectedProcedure
    .input(
      z.object({
        provider: z.enum(['SALESFORCE', 'HUBSPOT', 'PIPEDRIVE', 'ZOHO']),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const integration = await ctx.db.integration.findFirst({
        where: {
          organizationId: ctx.user.organizationId,
          provider: input.provider,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!integration) {
        return [];
      }

      const logs = await ctx.db.syncLog.findMany({
        where: {
          integrationId: integration.id,
        },
        orderBy: { startedAt: 'desc' },
        take: input.limit,
        select: {
          id: true,
          syncType: true,
          status: true,
          recordsSynced: true,
          errors: true,
          startedAt: true,
          completedAt: true,
        },
      });

      return logs;
    }),
});
