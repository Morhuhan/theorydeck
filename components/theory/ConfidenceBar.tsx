// components/theory/ConfidenceBar.tsx
"use client";

interface ConfidenceBarProps {
  forScore: number;
  againstScore: number;
  totalVotes: number;
}

export function ConfidenceBar({ forScore, againstScore, totalVotes }: ConfidenceBarProps) {
  const total = forScore + againstScore;
  const forPercent = total > 0 ? Math.round((forScore / total) * 100) : 50;
  const againstPercent = total > 0 ? 100 - forPercent : 50;

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Уверенность сообщества</h3>
        <span className="text-sm text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? "голос" : totalVotes < 5 ? "голоса" : "голосов"}
        </span>
      </div>

      {totalVotes > 0 ? (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-500 font-medium">За: {forPercent}%</span>
              <span className="text-red-500 font-medium">Против: {againstPercent}%</span>
            </div>
            
            <div className="relative h-4 rounded-full overflow-hidden bg-red-500/20">
              <div 
                className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500"
                style={{ width: `${forPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            На основе силы доказательств в карточках
          </p>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Пока нет голосов. Будьте первым, кто оценит доказательства!
          </p>
        </div>
      )}
    </div>
  );
}