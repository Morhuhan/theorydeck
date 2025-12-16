// components/theory/AllEvidence.tsx
"use client";

import { EvidenceCard, Stance } from "./EvidenceCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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

interface AllEvidenceProps {
  forCards: Evidence[];
  againstCards: Evidence[];
  onAddCard?: () => void;
  onVoteUpdate?: (cardId: string, newStrength: number) => void;
}

export function AllEvidence({ forCards, againstCards, onAddCard, onVoteUpdate }: AllEvidenceProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (forCards.length === 0 && againstCards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <span>Дополнительные доказательства ({forCards.length + againstCards.length})</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {forCards.map((card) => (
            <EvidenceCard 
              key={card.id} 
              {...card} 
              onVoteUpdate={onVoteUpdate}
            />
          ))}
          {againstCards.map((card) => (
            <EvidenceCard 
              key={card.id} 
              {...card} 
              onVoteUpdate={onVoteUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}