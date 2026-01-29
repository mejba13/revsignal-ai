import { router, protectedProcedure } from '../trpc';

export const dashboardRouter = router({
  /**
   * Get dashboard summary data
   */
  summary: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      pipelineStats,
      atRiskStats,
      wonDeals,
      lostDeals,
      topDeals,
      recentActivity,
    ] = await Promise.all([
      // Pipeline stats
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
        _avg: { aiScore: true },
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

      // Won deals (last 30 days)
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'WON',
          actualCloseDate: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Lost deals (last 30 days)
      ctx.db.deal.aggregate({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'LOST',
          actualCloseDate: { gte: thirtyDaysAgo },
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: true,
      }),

      // Top deals by amount
      ctx.db.deal.findMany({
        where: {
          organizationId: ctx.user.organizationId,
          status: 'OPEN',
          deletedAt: null,
        },
        orderBy: { amount: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          amount: true,
          stage: true,
          aiScore: true,
          riskLevel: true,
          expectedCloseDate: true,
          account: {
            select: { name: true },
          },
        },
      }),

      // Recent activity
      ctx.db.activity.findMany({
        where: {
          organizationId: ctx.user.organizationId,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          subject: true,
          createdAt: true,
          deal: {
            select: { id: true, name: true },
          },
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

    // Calculate win rate
    const totalClosed = wonDeals._count + lostDeals._count;
    const winRate = totalClosed > 0 ? (wonDeals._count / totalClosed) * 100 : 0;

    return {
      pipeline: {
        value: pipelineStats._sum.amount?.toNumber() ?? 0,
        count: pipelineStats._count,
        avgScore: pipelineStats._avg.aiScore ?? 0,
      },
      atRisk: {
        value: atRiskStats._sum.amount?.toNumber() ?? 0,
        count: atRiskStats._count,
      },
      performance: {
        wonValue: wonDeals._sum.amount?.toNumber() ?? 0,
        wonCount: wonDeals._count,
        lostValue: lostDeals._sum.amount?.toNumber() ?? 0,
        lostCount: lostDeals._count,
        winRate: Math.round(winRate),
      },
      topDeals: topDeals.map((deal) => ({
        id: deal.id,
        name: deal.name,
        amount: deal.amount?.toNumber() ?? 0,
        stage: deal.stage,
        aiScore: deal.aiScore,
        riskLevel: deal.riskLevel,
        expectedCloseDate: deal.expectedCloseDate,
        accountName: deal.account?.name ?? null,
      })),
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        type: activity.type,
        subject: activity.subject,
        createdAt: activity.createdAt,
        dealId: activity.deal?.id ?? null,
        dealName: activity.deal?.name ?? null,
        userName: activity.user
          ? `${activity.user.firstName} ${activity.user.lastName}`
          : null,
      })),
    };
  }),

  /**
   * Get pipeline breakdown by stage
   */
  pipelineByStage: protectedProcedure.query(async ({ ctx }) => {
    const stages = await ctx.db.deal.groupBy({
      by: ['stage'],
      where: {
        organizationId: ctx.user.organizationId,
        status: 'OPEN',
        deletedAt: null,
      },
      _sum: { amount: true },
      _count: true,
      _avg: { aiScore: true },
    });

    return stages.map((stage) => ({
      stage: stage.stage,
      value: stage._sum.amount?.toNumber() ?? 0,
      count: stage._count,
      avgScore: Math.round(stage._avg.aiScore ?? 0),
    }));
  }),

  /**
   * Get at-risk deals list
   */
  atRiskDeals: protectedProcedure.query(async ({ ctx }) => {
    const deals = await ctx.db.deal.findMany({
      where: {
        organizationId: ctx.user.organizationId,
        status: 'OPEN',
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
        deletedAt: null,
      },
      orderBy: [
        { riskLevel: 'desc' },
        { amount: 'desc' },
      ],
      take: 10,
      select: {
        id: true,
        name: true,
        amount: true,
        stage: true,
        aiScore: true,
        riskLevel: true,
        riskFactors: true,
        expectedCloseDate: true,
        lastActivityAt: true,
        account: {
          select: { name: true },
        },
        owner: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return deals.map((deal) => ({
      id: deal.id,
      name: deal.name,
      amount: deal.amount?.toNumber() ?? 0,
      stage: deal.stage,
      aiScore: deal.aiScore,
      riskLevel: deal.riskLevel,
      riskFactors: deal.riskFactors,
      expectedCloseDate: deal.expectedCloseDate,
      lastActivityAt: deal.lastActivityAt,
      accountName: deal.account?.name ?? null,
      ownerName: deal.owner
        ? `${deal.owner.firstName} ${deal.owner.lastName}`
        : null,
    }));
  }),
});
