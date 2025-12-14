// components/forms/VoteForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VoteFormProps {
  cardId: string;
  currentVote?: number | null;
  onVote?: (strength: number) => void;
}

const VOTE_OPTIONS = [
  { value: 0, label: "Не убедительно", color: "bg-gray-200 hover:bg-gray-300" },
  { value: 2, label: "Слабое", color: "bg-orange-100 hover:bg-orange-200" },
  { value: 5, label: "Среднее", color: "bg-yellow-100 hover:bg-yellow-200" },
  { value: 8, label: "Сильное", color: "bg-lime-100 hover:bg-lime-200" },
  { value: 10, label: "Очень сильное", color: "bg-green-100 hover:bg-green-200" },
];

export function VoteForm({ cardId, currentVote, onVote }: VoteFormProps) {
  const [selectedVote, setSelectedVote] = useState<number | null>(currentVote ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (strength: number) => {
    setIsLoading(true);
    setSelectedVote(strength);

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId, strength }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при голосовании");
      }

      onVote?.(strength);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
      setSelectedVote(currentVote ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Оцените силу доказательства</CardTitle>
        <CardDescription>
          Насколько это доказательство убедительно?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {VOTE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className={cn(
                "flex-1 min-w-[80px]",
                option.color,
                selectedVote === option.value && "ring-2 ring-primary"
              )}
              onClick={() => handleVote(option.value)}
            >
              <span className="font-bold mr-1">{option.value}</span>
              <span className="text-xs hidden sm:inline">{option.label}</span>
            </Button>
          ))}
        </div>
        {selectedVote !== null && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Ваша оценка: <strong>{selectedVote}</strong> из 10
          </p>
        )}
      </CardContent>
    </Card>
  );
}