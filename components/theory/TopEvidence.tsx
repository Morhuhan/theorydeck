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
  commentCount: number;
  authorName?: string;
}

interface TopEvidenceProps {
  title: string;
  stance: Stance;
  cards: Evidence[];
}

export function TopEvidence({ title, stance, cards }: TopEvidenceProps) {
  const borderColor = stance === "FOR" ? "border-green-500" : "border-red-500";
  const textColor = stance === "FOR" ? "text-green-500" : "text-red-500";

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${textColor} border-b-2 ${borderColor} pb-2`}>
        {title}
      </h3>
      
      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Пока нет карточек. Будьте первым!
        </p>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <EvidenceCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}