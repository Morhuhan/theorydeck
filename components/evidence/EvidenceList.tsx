import { EvidenceCardWithVotes } from '@/types';
import { EvidenceCard } from './EvidenceCard';

interface EvidenceListProps {
  cards: EvidenceCardWithVotes[];
  theorySlug: string;
  canVote: boolean;
}

export function EvidenceList({ cards, theorySlug, canVote }: EvidenceListProps) {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <EvidenceCard key={card.id} card={card} canVote={canVote} />
      ))}
    </div>
  );
}