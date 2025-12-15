// components/theory/TopEvidence.tsx
"use client";

import { EvidenceCard, Stance } from "./EvidenceCard";

interface Evidence {
  id: string;
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: Stance;
  voteCount: number;
  averageStrength: number;
  authorName?: string;
  authorId?: string;
  userVote?: number | null;
}

interface TopEvidenceProps {
  title: string;
  stance: Stance;
  cards: Evidence[];
  onVoteUpdate?: (cardId: string, newStrength: number) => void;
}

export function TopEvidence({ title, stance, cards, onVoteUpdate }: TopEvidenceProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Нет карточек
        </p>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <EvidenceCard key={card.id} {...card} onVoteUpdate={onVoteUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}