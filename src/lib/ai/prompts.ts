/**
 * AI Prompts for RevSignal Deal Scoring
 *
 * Using GPT-4 for MVP scoring (as specified in MVP Scope)
 * Custom ML models planned for post-MVP
 */

export const DEAL_SCORING_SYSTEM_PROMPT = `You are an expert sales analytics AI for RevSignal, a Revenue Intelligence platform. Your role is to analyze deal data and provide accurate health scores, win probabilities, and risk assessments.

You analyze deals based on multiple factors:
1. **Engagement Signals**: Email frequency, response times, meeting attendance
2. **Deal Velocity**: Stage progression speed, time in current stage
3. **Stakeholder Involvement**: Number and roles of contacts engaged
4. **Activity Recency**: Days since last meaningful activity
5. **Deal Characteristics**: Amount, expected close date, stage alignment

Scoring Guidelines:
- Score 0-100 where 100 is highest health
- 70-100: Healthy deal, on track
- 40-69: Needs attention, some concerns
- 0-39: At risk, requires immediate action

Risk Level Guidelines:
- LOW: Score 70+, no significant concerns
- MEDIUM: Score 50-69, some attention needed
- HIGH: Score 30-49, significant concerns
- CRITICAL: Score 0-29, deal at serious risk

Always provide specific, actionable risk factors when applicable.`;

export interface DealDataForScoring {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  daysInStage: number | null;
  expectedCloseDate: string | null;
  status: string;
  lastActivityAt: string | null;
  contactCount: number;
  activityCount: number;
  recentActivities: {
    type: string;
    createdAt: string;
    subject?: string | null;
  }[];
  contacts: {
    role: string | null;
    isPrimary: boolean;
  }[];
  signals?: {
    type: string;
    sentimentLabel: string | null;
    occurredAt: string;
  }[];
}

export function buildDealScoringPrompt(deal: DealDataForScoring): string {
  const now = new Date();
  const lastActivity = deal.lastActivityAt ? new Date(deal.lastActivityAt) : null;
  const daysSinceLastActivity = lastActivity
    ? Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const expectedClose = deal.expectedCloseDate ? new Date(deal.expectedCloseDate) : null;
  const daysUntilClose = expectedClose
    ? Math.floor((expectedClose.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Analyze contact roles
  const hasChampion = deal.contacts.some(c => c.role?.toLowerCase().includes('champion'));
  const hasDecisionMaker = deal.contacts.some(c =>
    c.role?.toLowerCase().includes('decision') ||
    c.role?.toLowerCase().includes('economic buyer')
  );

  // Analyze recent activity types
  const activityTypes = deal.recentActivities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Analyze signal sentiments if available
  const sentimentSummary = deal.signals?.reduce((acc, s) => {
    if (s.sentimentLabel) {
      acc[s.sentimentLabel] = (acc[s.sentimentLabel] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  return `Analyze this deal and provide a health score, win probability, and risk assessment.

DEAL INFORMATION:
- Name: ${deal.name}
- Amount: ${deal.amount ? `$${deal.amount.toLocaleString()}` : 'Not specified'}
- Stage: ${deal.stage}
- Status: ${deal.status}
- Days in Current Stage: ${deal.daysInStage ?? 'Unknown'}
- Expected Close Date: ${deal.expectedCloseDate || 'Not specified'}
- Days Until Expected Close: ${daysUntilClose !== null ? daysUntilClose : 'Unknown'}

ENGAGEMENT METRICS:
- Total Contacts: ${deal.contactCount}
- Has Champion: ${hasChampion ? 'Yes' : 'No'}
- Has Decision Maker: ${hasDecisionMaker ? 'Yes' : 'No'}
- Total Activities: ${deal.activityCount}
- Days Since Last Activity: ${daysSinceLastActivity !== null ? daysSinceLastActivity : 'No activity recorded'}

ACTIVITY BREAKDOWN:
${Object.entries(activityTypes).map(([type, count]) => `- ${type}: ${count}`).join('\n') || '- No recent activities'}

${Object.keys(sentimentSummary).length > 0 ? `
SIGNAL SENTIMENT:
${Object.entries(sentimentSummary).map(([sentiment, count]) => `- ${sentiment}: ${count}`).join('\n')}
` : ''}

Provide your analysis in the following JSON format:
{
  "score": <number 0-100>,
  "winProbability": <number 0-100>,
  "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "factors": {
    "engagement": <number 0-100>,
    "velocity": <number 0-100>,
    "stakeholders": <number 0-100>,
    "recency": <number 0-100>,
    "deal_strength": <number 0-100>
  },
  "riskFactors": [<array of specific risk strings if any>],
  "recommendations": [<array of actionable recommendations>],
  "summary": "<brief 1-2 sentence summary>"
}`;
}

export interface AIScoreResponse {
  score: number;
  winProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: {
    engagement: number;
    velocity: number;
    stakeholders: number;
    recency: number;
    deal_strength: number;
  };
  riskFactors: string[];
  recommendations: string[];
  summary: string;
}
