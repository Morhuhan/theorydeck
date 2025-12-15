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
  authorId?: string;
  userVote?: number | null;
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

/**
 * Рассчитывает статистику голосов для теории на основе карточек доказательств
 * @param evidenceCards - массив карточек доказательств
 * @returns объект со статистикой голосов
 */
export function calculateVoteStats(evidenceCards: EvidenceCard[]): VoteCalculationResult {
  const forCards = evidenceCards.filter((c) => c.stance === "FOR");
  const againstCards = evidenceCards.filter((c) => c.stance === "AGAINST");

  // Считаем только карточки с реальными голосами
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

  // Общее количество голосов
  const totalVotes = [...forCards, ...againstCards].reduce(
    (sum, card) => sum + (card.voteStats?.count || 0),
    0
  );

  // Рассчитываем проценты
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

/**
 * Фильтрует карточки по позиции
 * @param evidenceCards - массив карточек доказательств
 * @param stance - позиция ("FOR" или "AGAINST")
 * @returns отфильтрованный массив карточек
 */
export function filterCardsByStance(
  evidenceCards: EvidenceCard[],
  stance: "FOR" | "AGAINST"
): EvidenceCard[] {
  return evidenceCards.filter((c) => c.stance === stance);
}

/**
 * Преобразует карточки доказательств в формат для отображения
 * @param cards - массив карточек доказательств
 * @returns массив карточек с правильной структурой для компонентов
 */
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
    authorId: card.author?.id || card.authorId,
    userVote: card.userVote,
  }));
}