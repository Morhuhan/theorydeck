// components/theory/VoteStrength.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const STRENGTH_VALUES = [0, 2, 5, 8, 10] as const;

const STRENGTH_LABELS: Record<number, string> = {
  0: "Слабо",
  2: "Так себе",
  5: "Средне",
  8: "Сильно",
  10: "Очень сильно",
};

interface VoteStrengthProps {
  cardId: string;
  cardAuthorId: string;
  currentVote?: number | null;
  onVoteSuccess?: () => void;
  className?: string;
}

export function VoteStrength({ 
  cardId, 
  cardAuthorId, 
  currentVote, 
  onVoteSuccess,
  className 
}: VoteStrengthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStrength, setSelectedStrength] = useState<number | null>(currentVote ?? null);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем, является ли текущий пользователь автором карточки
  const isOwnCard = session?.user?.id === cardAuthorId;

  const handleVote = async (strength: number) => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (isOwnCard) {
      alert("Вы не можете голосовать за свою собственную карточку");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          strength,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при голосовании");
      }

      setSelectedStrength(strength);
      onVoteSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOwnCard) {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-xs font-medium text-muted-foreground text-center py-2">
          Вы не можете голосовать за свою карточку
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-xs font-medium text-muted-foreground text-center">
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0"
            onClick={() => router.push("/login")}
          >
            Войдите
          </Button>
          {" "}для голосования
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Насколько сильное доказательство?
      </p>
      
      <div className="flex gap-1.5">
        {STRENGTH_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => handleVote(value)}
            disabled={isLoading}
            className={cn(
              "relative group flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all border bg-background hover:bg-accent hover:border-accent-foreground/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
              selectedStrength === value && "bg-primary text-primary-foreground border-primary"
            )}
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