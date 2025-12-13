import { EvidenceCardWithVotes } from '@/types';

export type ConfidenceScore = {
  forScore: number;
  againstScore: number;
  totalScore: number;
  confidence: number;
  forCards: number;
  againstCards: number;
};

export function calculateConfidence(
  cards: Array<{ 
    stance: 'FOR' | 'AGAINST'; 
    averageStrength: number;
    status: string;
  }>
): ConfidenceScore {
  const activeCards = cards.filter(card => card.status === 'ACTIVE');
  
  const forCards = activeCards.filter(card => card.stance === 'FOR');
  const againstCards = activeCards.filter(card => card.stance === 'AGAINST');
  
  const forScore = forCards.reduce((sum, card) => sum + card.averageStrength, 0);
  const againstScore = againstCards.reduce((sum, card) => sum + card.averageStrength, 0);
  
  const totalScore = forScore + againstScore;
  
  let confidence = 50;
  if (totalScore > 0) {
    confidence = (forScore / totalScore) * 100;
  }
  
  return {
    forScore,
    againstScore,
    totalScore,
    confidence: Math.round(confidence),
    forCards: forCards.length,
    againstCards: againstCards.length,
  };
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 80) return 'Very High';
  if (confidence >= 65) return 'High';
  if (confidence >= 45) return 'Moderate';
  if (confidence >= 30) return 'Low';
  return 'Very Low';
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'bg-green-500';
  if (confidence >= 65) return 'bg-lime-500';
  if (confidence >= 45) return 'bg-yellow-500';
  if (confidence >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}