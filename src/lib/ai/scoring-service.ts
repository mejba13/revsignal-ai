import { RiskLevel } from '@prisma/client';
import { db } from '@/lib/db';
import { getOpenAIClient } from './openai';
import {
  DEAL_SCORING_SYSTEM_PROMPT,
  buildDealScoringPrompt,
  AIScoreResponse,
  DealDataForScoring,
} from './prompts';

const MODEL = 'gpt-4-turbo-preview';
const MODEL_VERSION = 'gpt-4-turbo-v1';

// Use the same type as our db export
type DbClient = typeof db;

interface ScoringResult {
  success: boolean;
  dealId: string;
  score?: AIScoreResponse;
  error?: string;
}

export type { ScoringResult };

/**
 * Score a single deal using GPT-4
 */
export async function scoreDeal(
  dbClient: DbClient,
  dealId: string,
  organizationId: string
): Promise<ScoringResult> {
  try {
    // Fetch deal with all relevant data
    const deal = await dbClient.deal.findFirst({
      where: {
        id: dealId,
        organizationId,
        deletedAt: null,
      },
      include: {
        contacts: {
          include: {
            contact: {
              select: {
                role: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            type: true,
            subject: true,
            createdAt: true,
          },
        },
        signals: {
          orderBy: { occurredAt: 'desc' },
          take: 30,
          select: {
            type: true,
            sentimentLabel: true,
            occurredAt: true,
          },
        },
        _count: {
          select: {
            contacts: true,
            activities: true,
          },
        },
      },
    });

    if (!deal) {
      return {
        success: false,
        dealId,
        error: 'Deal not found',
      };
    }

    // Prepare deal data for scoring
    const dealData: DealDataForScoring = {
      id: deal.id,
      name: deal.name,
      amount: deal.amount?.toNumber() ?? null,
      stage: deal.stage,
      daysInStage: deal.daysInStage,
      expectedCloseDate: deal.expectedCloseDate?.toISOString() ?? null,
      status: deal.status,
      lastActivityAt: deal.lastActivityAt?.toISOString() ?? null,
      contactCount: deal._count.contacts,
      activityCount: deal._count.activities,
      recentActivities: deal.activities.map((a: { type: string; createdAt: Date; subject: string | null }) => ({
        type: a.type,
        createdAt: a.createdAt.toISOString(),
        subject: a.subject,
      })),
      contacts: deal.contacts.map((dc: { role: string | null; isPrimary: boolean; contact: { role: string | null } }) => ({
        role: dc.role ?? dc.contact.role,
        isPrimary: dc.isPrimary,
      })),
      signals: deal.signals.map((s: { type: string; sentimentLabel: string | null; occurredAt: Date }) => ({
        type: s.type,
        sentimentLabel: s.sentimentLabel,
        occurredAt: s.occurredAt.toISOString(),
      })),
    };

    // Call OpenAI for scoring
    const openai = getOpenAIClient();
    const prompt = buildDealScoringPrompt(dealData);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: DEAL_SCORING_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent scoring
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return {
        success: false,
        dealId,
        error: 'Empty response from AI',
      };
    }

    // Parse the AI response
    const aiScore: AIScoreResponse = JSON.parse(responseText);

    // Validate response
    if (
      typeof aiScore.score !== 'number' ||
      aiScore.score < 0 ||
      aiScore.score > 100
    ) {
      return {
        success: false,
        dealId,
        error: 'Invalid score in AI response',
      };
    }

    // Save the score to database
    await dbClient.$transaction([
      // Update deal with new score
      dbClient.deal.update({
        where: { id: dealId },
        data: {
          aiScore: aiScore.score,
          aiWinProbability: aiScore.winProbability,
          aiScoreFactors: aiScore.factors,
          riskLevel: aiScore.riskLevel as RiskLevel,
          riskFactors: aiScore.riskFactors,
          scoredAt: new Date(),
        },
      }),
      // Create score history record
      dbClient.dealScore.create({
        data: {
          dealId,
          score: aiScore.score,
          winProbability: aiScore.winProbability,
          factors: {
            ...aiScore.factors,
            riskFactors: aiScore.riskFactors,
            recommendations: aiScore.recommendations,
            summary: aiScore.summary,
          },
          modelVersion: MODEL_VERSION,
        },
      }),
    ]);

    return {
      success: true,
      dealId,
      score: aiScore,
    };
  } catch (error) {
    console.error(`Error scoring deal ${dealId}:`, error);
    return {
      success: false,
      dealId,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Score multiple deals for an organization
 */
export async function scoreOrganizationDeals(
  dbClient: DbClient,
  organizationId: string,
  options: {
    limit?: number;
    onlyUnscored?: boolean;
    staleThresholdHours?: number;
  } = {}
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: ScoringResult[];
}> {
  const { limit = 50, onlyUnscored = false, staleThresholdHours = 24 } = options;

  const staleThreshold = new Date(
    Date.now() - staleThresholdHours * 60 * 60 * 1000
  );

  // Find deals that need scoring
  const deals = await dbClient.deal.findMany({
    where: {
      organizationId,
      status: 'OPEN',
      deletedAt: null,
      ...(onlyUnscored
        ? { aiScore: null }
        : {
            OR: [
              { aiScore: null },
              { scoredAt: null },
              { scoredAt: { lt: staleThreshold } },
            ],
          }),
    },
    select: { id: true },
    take: limit,
    orderBy: [
      { aiScore: { sort: 'asc', nulls: 'first' } },
      { scoredAt: { sort: 'asc', nulls: 'first' } },
    ],
  });

  const results: ScoringResult[] = [];

  // Score deals sequentially to avoid rate limits
  for (const deal of deals) {
    const result = await scoreDeal(dbClient, deal.id, organizationId);
    results.push(result);

    // Small delay to avoid hitting rate limits
    if (deals.length > 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return {
    total: results.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

/**
 * Calculate days in stage for all open deals
 */
export async function updateDaysInStage(
  dbClient: DbClient,
  organizationId: string
): Promise<number> {
  const now = new Date();

  // Get all open deals with stage entered date
  const deals = await dbClient.deal.findMany({
    where: {
      organizationId,
      status: 'OPEN',
      deletedAt: null,
      stageEnteredAt: { not: null },
    },
    select: {
      id: true,
      stageEnteredAt: true,
    },
  });

  let updated = 0;

  for (const deal of deals) {
    if (deal.stageEnteredAt) {
      const daysInStage = Math.floor(
        (now.getTime() - deal.stageEnteredAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      await dbClient.deal.update({
        where: { id: deal.id },
        data: { daysInStage },
      });

      updated++;
    }
  }

  return updated;
}
