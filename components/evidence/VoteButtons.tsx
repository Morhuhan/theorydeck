'use client';

import { useState } from 'react';
import { VoteStrength, VOTE_STRENGTHS } from '@/types';
import { VOTE_STRENGTH_LABELS } from '@/lib/constants/vote-strengths';
import { Button } from '@/components/ui/button';

interface VoteButtonsProps {
  cardId: string;
  currentVote?: number;
  averageStrength: number;
  totalVotes: number;
  disabled?: boolean;
}

export function VoteButtons({
  cardId,
  currentVote,
  averageStrength,
  totalVotes,
  disabled = false,
}: VoteButtonsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [selectedVote, setSelectedVote] = useState<number | undefined>(currentVote);

  async function handleVote(strength: VoteStrength) {
    if (disabled || isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/evidence-cards/${cardId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strength }),
      });

      if (response.ok) {
        setSelectedVote(strength);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center mb-2">
        <div className="text-2xl font-bold">{averageStrength.toFixed(1)}</div>
        <div className="text-xs text-gray-500">{totalVotes} votes</div>
      </div>

      <div className="flex flex-col gap-1">
        {VOTE_STRENGTHS.map((strength) => (
          <Button
            key={strength}
            size="sm"
            variant={selectedVote === strength ? 'default' : 'outline'}
            onClick={() => handleVote(strength)}
            disabled={disabled || isVoting}
            className="w-12 h-8 text-xs"
            title={VOTE_STRENGTH_LABELS[strength]}
          >
            {strength}
          </Button>
        ))}
      </div>
    </div>
  );
}