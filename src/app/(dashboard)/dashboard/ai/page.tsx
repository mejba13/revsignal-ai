import { Metadata } from 'next';
import { AIScoringSummary } from './ai-scoring-summary';

export const metadata: Metadata = {
  title: 'AI Scoring',
};

export default function AIPage() {
  return <AIScoringSummary />;
}
