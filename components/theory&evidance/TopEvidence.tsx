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
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <EvidenceCard key={card.id} {...card} onVoteUpdate={onVoteUpdate} />
      ))}
    </div>
  );
}