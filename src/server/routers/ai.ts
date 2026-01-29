import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { scoreDeal, scoreOrganizationDeals, updateDaysInStage } from '@/lib/ai/scoring-service';

export const aiRouter = router({
  /**
   * Score a single deal
   */
  scoreDeal: protectedProcedure
    .input(z.object({ dealId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify deal belongs to user's organization
      const deal = await ctx.db.deal.findFirst({
        where: {
          id: input.dealId,
          organizationId: ctx.user.organizationId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      const result = await scoreDeal(ctx.db, input.dealId, ctx.user.organizationId);

      if (!result.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error || 'Failed to score deal',
        });
      }

      return {
        dealId: result.dealId,
        score: result.score?.score,
        winProbability: result.score?.winProbability,
        riskLevel: result.score?.riskLevel,
        factors: result.score?.factors,
        riskFactors: result.score?.riskFactors,
        recommendations: result.score?.recommendations,
        summary: result.score?.summary,
      };
    }),

  /**
   * Score multiple deals (batch operation)
   * Admin only for bulk operations
   */
  scoreDeals: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(25),
        onlyUnscored: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await scoreOrganizationDeals(ctx.db, ctx.user.organizationId, {
        limit: input.limit,
        onlyUnscored: input.onlyUnscored,
      });

      return {
        total: result.total,
        successful: result.successful,
        failed: result.failed,
        results: result.results.map((r) => ({
          dealId: r.dealId,
          success: r.success,
          error: r.error,
          score: r.score?.score,
        })),
      };
    }),

  /**
   * Get the latest AI score and recommendations for a deal
   */
  getDealScore: protectedProcedure
    .input(z.object({ dealId: z.string() }))
    .query(async ({ ctx, input }) => {
      const deal = await ctx.db.deal.findFirst({
        where: {
          id: input.dealId,
          organizationId: ctx.user.organizationId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          aiScore: true,
          aiWinProbability: true,
          aiScoreFactors: true,
          riskLevel: true,
          riskFactors: true,
          scoredAt: true,
        },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      // Get the latest score history for recommendations
      const latestScore = await ctx.db.dealScore.findFirst({
        where: { dealId: input.dealId },
        orderBy: { calculatedAt: 'desc' },
      });

      const factors = latestScore?.factors as {
        recommendations?: string[];
        summary?: string;
      } | null;

      return {
        dealId: deal.id,
        dealName: deal.name,
        score: deal.aiScore,
        winProbability: deal.aiWinProbability?.toNumber() ?? null,
        factors: deal.aiScoreFactors,
        riskLevel: deal.riskLevel,
        riskFactors: deal.riskFactors,
        recommendations: factors?.recommendations || [],
        summary: factors?.summary || null,
        scoredAt: deal.scoredAt,
        isStale: deal.scoredAt
          ? Date.now() - deal.scoredAt.getTime() > 24 * 60 * 60 * 1000
          : true,
      };
    }),

  /**
   * Get score history for a deal
   */
  getScoreHistory: protectedProcedure
    .input(
      z.object({
        dealId: z.string(),
        limit: z.number().min(1).max(50).optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify deal access
      const deal = await ctx.db.deal.findFirst({
        where: {
          id: input.dealId,
          organizationId: ctx.user.organizationId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      const scores = await ctx.db.dealScore.findMany({
        where: { dealId: input.dealId },
        orderBy: { calculatedAt: 'desc' },
        take: input.limit,
      });

      return scores.map((s) => ({
        id: s.id,
        score: s.score,
        winProbability: s.winProbability.toNumber(),
        factors: s.factors,
        modelVersion: s.modelVersion,
        calculatedAt: s.calculatedAt,
      }));
    }),

  /**
   * Update days in stage for all deals
   * Admin only
   */
  updateDaysInStage: adminProcedure.mutation(async ({ ctx }) => {
    const updated = await updateDaysInStage(ctx.db, ctx.user.organizationId);
    return { updated };
  }),

  /**
   * Get scoring statistics for the organization
   */
  scoringStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalDeals, scoredDeals, staleScores, avgScore] = await Promise.all([
      // Total open deals
      ctx.db.deal.count({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
        },
      }),
      // Deals with scores
      ctx.db.deal.count({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
          aiScore: { not: null },
        },
      }),
      // Stale scores (older than 24 hours)
      ctx.db.deal.count({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
          aiScore: { not: null },
          scoredAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Average score
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
          aiScore: { not: null },
        },
        _avg: { aiScore: true },
      }),
    ]);

    // Score distribution
    const distribution = await ctx.db.deal.groupBy({
      by: ['riskLevel'],
      where: {
        organizationId: ctx.user.organizationId,
        status: 'OPEN',
        deletedAt: null,
        riskLevel: { not: null },
      },
      _count: true,
    });

    return {
      totalDeals,
      scoredDeals,
      unscoredDeals: totalDeals - scoredDeals,
      staleScores,
      averageScore: avgScore._avg.aiScore ?? null,
      coveragePercent: totalDeals > 0 ? Math.round((scoredDeals / totalDeals) * 100) : 0,
      distribution: distribution.map((d) => ({
        riskLevel: d.riskLevel,
        count: d._count,
      })),
    };
  }),
});
