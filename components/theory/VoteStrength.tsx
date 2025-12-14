// components/theory/VoteStrength.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STRENGTH_VALUES = [0, 2, 5, 8, 10] as const;

const STRENGTH_LABELS: Record<number, string> = {
  0: "Слабо",
  2: "Так себе",
  5: "Средне",
  8: "Сильно",
  10: "Очень сильно",
};

interface VoteStrengthProps {
  className?: string;
}

export function VoteStrength({ className }: VoteStrengthProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Насколько сильное доказательство?
      </p>
      
      <div className="flex gap-1.5">
        {STRENGTH_VALUES.map((value) => (
          <button
            key={value}
            className="relative group flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all border bg-background hover:bg-accent hover:border-accent-foreground/20 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-base font-bold">{value}</span>
              <span className="text-[10px] opacity-80 hidden sm:block">
                {STRENGTH_LABELS[value]}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Не убедительно</span>
        <span>Неопровержимо</span>
      </div>
    </div>
  );
}