import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const dealsRouter = router({
  /**
   * List deals with filters and pagination
   */
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(25),
        search: z.string().optional(),
        stage: z.string().optional(),
        ownerId: z.string().optional(),
        riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        forecastCategory: z.enum(['COMMIT', 'BEST_CASE', 'PIPELINE', 'OMIT']).optional(),
        status: z.enum(['OPEN', 'WON', 'LOST', 'STALLED']).optional(),
        sortBy: z.enum(['amount', 'aiScore', 'expectedCloseDate', 'createdAt', 'name']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, stage, ownerId, riskLevel, forecastCategory, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where = {
        organizationId: ctx.user.organizationId,
        deletedAt: null,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { account: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }),
        ...(stage && { stage }),
        ...(ownerId && { ownerId }),
        ...(riskLevel && { riskLevel }),
        ...(forecastCategory && { forecastCategory }),
        ...(status && { status }),
      };

      const [deals, total] = await Promise.all([
        ctx.db.deal.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            account: {
              select: { id: true, name: true },
            },
            owner: {
              select: { id: true, firstName: true, lastName: true },
            },
            _count: {
              select: { contacts: true, activities: true },
            },
          },
        }),
        ctx.db.deal.count({ where }),
      ]);

      return {
        deals: deals.map((deal) => ({
          id: deal.id,
          name: deal.name,
          amount: deal.amount?.toNumber() ?? null,
          currency: deal.currency,
          stage: deal.stage,
          aiScore: deal.aiScore,
          riskLevel: deal.riskLevel,
          forecastCategory: deal.forecastCategory,
          expectedCloseDate: deal.expectedCloseDate,
          status: deal.status,
          account: deal.account,
          owner: deal.owner
            ? `${deal.owner.firstName} ${deal.owner.lastName}`
            : null,
          ownerId: deal.ownerId,
          contactCount: deal._count.contacts,
          activityCount: deal._count.activities,
          lastActivityAt: deal.lastActivityAt,
          createdAt: deal.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get single deal by ID
   */
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const deal = await ctx.db.deal.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.user.organizationId,
          deletedAt: null,
        },
        include: {
          account: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
          contacts: {
            include: {
              contact: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  title: true,
                },
              },
            },
          },
          scores: {
            orderBy: { calculatedAt: 'desc' },
            take: 5,
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      return {
        id: deal.id,
        name: deal.name,
        description: deal.description,
        amount: deal.amount?.toNumber() ?? null,
        currency: deal.currency,
        stage: deal.stage,
        stageEnteredAt: deal.stageEnteredAt,
        probability: deal.probability,
        aiScore: deal.aiScore,
        aiWinProbability: deal.aiWinProbability?.toNumber() ?? null,
        aiScoreFactors: deal.aiScoreFactors,
        riskLevel: deal.riskLevel,
        riskFactors: deal.riskFactors,
        forecastCategory: deal.forecastCategory,
        expectedCloseDate: deal.expectedCloseDate,
        actualCloseDate: deal.actualCloseDate,
        status: deal.status,
        lossReason: deal.lossReason,
        nextAction: deal.nextAction,
        nextActionDate: deal.nextActionDate,
        lastActivityAt: deal.lastActivityAt,
        daysInStage: deal.daysInStage,
        account: deal.account,
        owner: deal.owner,
        contacts: deal.contacts.map((dc) => ({
          ...dc.contact,
          role: dc.role,
          isPrimary: dc.isPrimary,
        })),
        scoreHistory: deal.scores.map((s) => ({
          score: s.score,
          winProbability: s.winProbability.toNumber(),
          factors: s.factors,
          calculatedAt: s.calculatedAt,
        })),
        recentActivities: deal.activities.map((a) => ({
          id: a.id,
          type: a.type,
          subject: a.subject,
          description: a.description,
          createdAt: a.createdAt,
          user: a.user ? `${a.user.firstName} ${a.user.lastName}` : null,
        })),
        createdAt: deal.createdAt,
        updatedAt: deal.updatedAt,
      };
    }),

  /**
   * Update deal forecast category
   */
  updateForecastCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        forecastCategory: z.enum(['COMMIT', 'BEST_CASE', 'PIPELINE', 'OMIT']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deal = await ctx.db.deal.updateMany({
        where: {
          id: input.id,
          organizationId: ctx.user.organizationId,
          deletedAt: null,
        },
        data: {
          forecastCategory: input.forecastCategory,
        },
      });

      if (deal.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      return { success: true };
    }),

  /**
   * Get deal statistics summary
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    const [pipelineValue, atRiskDeals, dealsByStage, recentWins] = await Promise.all([
      // Total pipeline value
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),

      // At-risk deals
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          riskLevel: { in: ['HIGH', 'CRITICAL'] },
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Deals by stage
      ctx.db.deal.groupBy({
        by: ['stage'],
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Recent wins (last 30 days)
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'WON',
          actualCloseDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      pipelineValue: pipelineValue._sum.amount?.toNumber() ?? 0,
      pipelineCount: pipelineValue._count,
      atRiskValue: atRiskDeals._sum.amount?.toNumber() ?? 0,
      atRiskCount: atRiskDeals._count,
      recentWinsValue: recentWins._sum.amount?.toNumber() ?? 0,
      recentWinsCount: recentWins._count,
      dealsByStage: dealsByStage.map((s) => ({
        stage: s.stage,
        value: s._sum.amount?.toNumber() ?? 0,
        count: s._count,
      })),
    };
  }),
});
