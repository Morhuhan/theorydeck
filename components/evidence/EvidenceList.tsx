interface EvidenceListProps {
  cards: Array<{
    id: string;
    stance: 'FOR' | 'AGAINST';
    status: string;
    _count: {
      votes: number;
    };
  }>;
  theorySlug: string;
}

export function EvidenceList({ cards, theorySlug }: EvidenceListProps) {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Evidence Card #{card.id.slice(0, 8)}</span>
            <span className="text-sm text-gray-600">{card._count.votes} votes</span>
          </div>
        </div>
      ))}
    </div>
  );
}