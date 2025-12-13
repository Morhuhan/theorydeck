// components/theory/AllEvidence.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EvidenceCard, Stance } from "./EvidenceCard";

interface Evidence {
  id: string;
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: Stance;
  voteCount: number;
  averageStrength: number;
  commentCount: number;
  authorName?: string;
}

interface AllEvidenceProps {
  forCards: Evidence[];
  againstCards: Evidence[];
  onAddCard?: () => void;
}

export function AllEvidence({ forCards, againstCards, onAddCard }: AllEvidenceProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Все доказательства</h2>
        <Button onClick={onAddCard}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить карточку
        </Button>
      </div>

      <Tabs defaultValue="for" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="for" className="data-[state=active]:bg-green-500/10">
            За ({forCards.length})
          </TabsTrigger>
          <TabsTrigger value="against" className="data-[state=active]:bg-red-500/10">
            Против ({againstCards.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="for" className="space-y-4 mt-4">
          {forCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Нет карточек в поддержку теории
            </p>
          ) : (
            forCards.map((card) => (
              <EvidenceCard key={card.id} {...card} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="against" className="space-y-4 mt-4">
          {againstCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Нет карточек против теории
            </p>
          ) : (
            againstCards.map((card) => (
              <EvidenceCard key={card.id} {...card} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}