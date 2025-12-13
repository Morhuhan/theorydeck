import { EvidenceCardWithVotes } from '@/types';
import { Card } from '@/components/ui/card';
import { VoteButtons } from './VoteButtons';
import { formatRelativeTime } from '@/lib/utils/formatting';
import { ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface EvidenceCardProps {
  card: EvidenceCardWithVotes;
  canVote: boolean;
}

export function EvidenceCard({ card, canVote }: EvidenceCardProps) {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <VoteButtons
            cardId={card.id}
            currentVote={card.userVote?.strength}
            averageStrength={card.averageStrength}
            totalVotes={card._count.votes}
            disabled={!canVote}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <p className="text-gray-800 whitespace-pre-wrap">{card.content}</p>
          </div>

          {card.context && (
            <div className="mb-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700 italic">{card.context}</p>
            </div>
          )}

          {card.source && (
            <div className="mb-3">
              <a
                href={card.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                {card.sourceTitle || 'Source'}
              </a>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
            <div className="flex items-center gap-3">
              <span>
                By {card.author.name || 'Anonymous'}
              </span>
              <span>•</span>
              <span>{formatRelativeTime(card.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{card._count.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}