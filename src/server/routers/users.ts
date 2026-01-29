import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const usersRouter = router({
  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            subscriptionTier: true,
            subscriptionStatus: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      organization: user.organization,
    };
  }),

  /**
   * Update current user profile
   */
  update: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        avatarUrl: z.string().url().optional().nullable(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      };
    }),

  /**
   * List all users in organization (admin only)
   */
  list: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      where: {
        organizationId: ctx.user.organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return users;
  }),

  /**
   * Invite a new user to the organization
   */
  invite: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']).default('MEMBER'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email.toLowerCase() },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with this email already exists',
        });
      }

      // Create invited user
      const user = await ctx.db.user.create({
        data: {
          organizationId: ctx.user.organizationId,
          email: input.email.toLowerCase(),
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          status: 'INVITED',
        },
      });

      // TODO: Send invitation email

      return {
        id: user.id,
        email: user.email,
        status: user.status,
      };
    }),

  /**
   * Update user role (admin only)
   */
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent self-demotion from admin
      if (input.userId === ctx.user.id && input.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot change your own admin role',
        });
      }

      const user = await ctx.db.user.update({
        where: {
          id: input.userId,
          organizationId: ctx.user.organizationId,
        },
        data: { role: input.role },
      });

      return {
        id: user.id,
        role: user.role,
      };
    }),

  /**
   * Remove user from organization (admin only)
   */
  remove: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Prevent self-removal
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot remove yourself from the organization',
        });
      }

      await ctx.db.user.update({
        where: {
          id: input.userId,
          organizationId: ctx.user.organizationId,
        },
        data: {
          deletedAt: new Date(),
          status: 'SUSPENDED',
        },
      });

      return { success: true };
    }),
});
