// lib/utils/vote-stats.ts

export interface EvidenceCard {
  id: string;
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: "FOR" | "AGAINST";
  voteStats?: {
    count: number;
    averageStrength: number;
  };
  authorName?: string;
  author?: {
    id: string;
    name?: string;
  };
}

export interface VoteCalculationResult {
  forScore: number;
  againstScore: number;
  totalVotes: number;
  forPercent: number;
  againstPercent: number;
}

export function calculateVoteStats(evidenceCards: EvidenceCard[]): VoteCalculationResult {
  const forCards = evidenceCards.filter((c) => c.stance === "FOR");
  const againstCards = evidenceCards.filter((c) => c.stance === "AGAINST");

  const forScore = forCards.reduce((sum, card) => {
    if (card.voteStats?.count && card.voteStats.count > 0) {
      return sum + (card.voteStats.averageStrength * card.voteStats.count);
    }
    return sum;
  }, 0);

  const againstScore = againstCards.reduce((sum, card) => {
    if (card.voteStats?.count && card.voteStats.count > 0) {
      return sum + (card.voteStats.averageStrength * card.voteStats.count);
    }
    return sum;
  }, 0);

  const totalVotes = [...forCards, ...againstCards].reduce(
    (sum, card) => sum + (card.voteStats?.count || 0),
    0
  );

  const total = forScore + againstScore;
  const forPercent = total > 0 ? Math.round((forScore / total) * 100) : 50;
  const againstPercent = total > 0 ? 100 - forPercent : 50;

  return {
    forScore,
    againstScore,
    totalVotes,
    forPercent,
    againstPercent,
  };
}


export function filterCardsByStance(
  evidenceCards: EvidenceCard[],
  stance: "FOR" | "AGAINST"
): EvidenceCard[] {
  return evidenceCards.filter((c) => c.stance === stance);
}


export function mapEvidenceCards(cards: EvidenceCard[]) {
  return cards.map((card) => ({
    id: card.id,
    content: card.content,
    source: card.source,
    sourceTitle: card.sourceTitle,
    context: card.context,
    stance: card.stance,
    voteCount: card.voteStats?.count || 0,
    averageStrength: card.voteStats?.averageStrength || 0,
    authorName: card.author?.name || card.authorName || "Аноним",
  }));
}