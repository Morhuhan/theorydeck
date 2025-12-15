// components/theory/TheoryList.tsx
"use client";

import { useEffect, useState } from "react";
import { TheoryCard } from "./TheoryCard";

interface Theory {
  id: string;
  slug: string;
  title: string;
  claim: string;
  tldr: string;
  realm?: string | null;
  topic?: string | null;
  tags: string[];
  status: string;
  createdAt: string;
  author: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  _count: {
    evidenceCards: number;
  };
}

export function TheoryList() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTheories() {
      try {
        const response = await fetch("/api/theories");

        if (!response.ok) {
          throw new Error("Ошибка при загрузке теорий");
        }

        const data = await response.json();
        setTheories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    }

    loadTheories();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8 text-center py-12">
        <p className="text-muted-foreground">Загрузка теорий...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (theories.length === 0) {
    return (
      <div className="mb-8 text-center py-12">
        <p className="text-muted-foreground">Пока нет теорий. Создайте первую!</p>
      </div>
    );
  }

  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr max-w-8xl mx-auto">
      {theories.map((theory) => (
        <TheoryCard
          key={theory.id}
          id={theory.id}
          slug={theory.slug}
          title={theory.title}
          claim={theory.claim}
          tldr={theory.tldr}
          realm={theory.realm || undefined}
          topic={theory.topic || undefined}
          tags={theory.tags}
          status={theory.status as any}
          createdAt={new Date(theory.createdAt)}
          authorName={theory.author.name || theory.author.email || "Аноним"}
          evidenceCount={theory._count.evidenceCards}
          forPercent={50}
        />
      ))}
    </div>
  );
}