export { getOpenAIClient } from './openai';
export {
  DEAL_SCORING_SYSTEM_PROMPT,
  buildDealScoringPrompt,
  type DealDataForScoring,
  type AIScoreResponse,
} from './prompts';
export {
  scoreDeal,
  scoreOrganizationDeals,
  updateDaysInStage,
  type ScoringResult,
} from './scoring-service';
