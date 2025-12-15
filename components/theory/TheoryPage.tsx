// components/theory/TheoryPage.tsx
"use client";

import { useEffect, useState } from "react";
import { TheoryHeader } from "./TheoryHeader";
import { TheoryTLDR } from "./TheoryTLDR";
import { ConfidenceBar } from "./ConfidenceBar";
import { TopEvidence } from "./TopEvidence";
import { AllEvidence } from "./AllEvidence";
import { EvidenceForm } from "@/components/forms/EvidenceForm";
import { ReportForm } from "@/components/forms/ReportForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { calculateVoteStats, filterCardsByStance, mapEvidenceCards } from "@/lib/utils/vote-stats";

interface TheoryPageProps {
  slug: string;
}

export function TheoryPage({ slug }: TheoryPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [theory, setTheory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEvidenceFormOpen, setIsEvidenceFormOpen] = useState(false);
  const [isTheoryReportModalOpen, setIsTheoryReportModalOpen] = useState(false);

  const loadTheory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/theories/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Теория не найдена");
        }
        throw new Error("Ошибка при загрузке теории");
      }

      const data = await response.json();
      setTheory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTheory();
  }, [slug]);

  const handleAddEvidence = () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    setIsEvidenceFormOpen(true);
  };

  const handleVoteUpdate = (cardId: string, newStrength: number) => {
    setTheory((prevTheory: any) => {
      if (!prevTheory) return prevTheory;

      const updatedCards = prevTheory.evidenceCards.map((card: any) => {
        if (card.id === cardId) {
          const currentVotes = card.voteStats?.count || 0;
          const currentAvg = card.voteStats?.averageStrength || 0;
          const userHadVote = card.userVote !== null && card.userVote !== undefined;

          let newVoteCount: number;
          let newAvgStrength: number;

          if (userHadVote) {
            const totalStrength = currentAvg * currentVotes;
            const newTotalStrength = totalStrength - (card.userVote || 0) + newStrength;
            newVoteCount = currentVotes;
            newAvgStrength = newTotalStrength / newVoteCount;
          } else {
            const totalStrength = currentAvg * currentVotes;
            const newTotalStrength = totalStrength + newStrength;
            newVoteCount = currentVotes + 1;
            newAvgStrength = newTotalStrength / newVoteCount;
          }

          return {
            ...card,
            voteStats: {
              count: newVoteCount,
              averageStrength: newAvgStrength,
            },
            userVote: newStrength,
          };
        }
        return card;
      });

      return {
        ...prevTheory,
        evidenceCards: updatedCards,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (error || !theory) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || "Теория не найдена"}</p>
      </div>
    );
  }

  const forCards = mapEvidenceCards(filterCardsByStance(theory.evidenceCards, "FOR"));
  const againstCards = mapEvidenceCards(filterCardsByStance(theory.evidenceCards, "AGAINST"));
  const voteStats = calculateVoteStats(theory.evidenceCards);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <TheoryHeader
        title={theory.title}
        realm={theory.realm}
        topic={theory.topic}
        tags={theory.tags}
        status={theory.status}
      />

      <TheoryTLDR claim={theory.claim} tldr={theory.tldr} />

      <ConfidenceBar
        forScore={voteStats.forScore}
        againstScore={voteStats.againstScore}
        totalVotes={voteStats.totalVotes}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <TopEvidence title="Топ доказательств ЗА" stance="FOR" cards={forCards.slice(0, 3)} onVoteUpdate={handleVoteUpdate} />
        <TopEvidence title="Топ доказательств ПРОТИВ" stance="AGAINST" cards={againstCards.slice(0, 3)} onVoteUpdate={handleVoteUpdate} />
      </div>

      <AllEvidence 
        forCards={forCards} 
        againstCards={againstCards} 
        onAddCard={handleAddEvidence}
        onVoteUpdate={handleVoteUpdate}
      />

      {status === "authenticated" && (
        <EvidenceForm
          theoryId={theory.id}
          open={isEvidenceFormOpen}
          onOpenChange={setIsEvidenceFormOpen}
          onSuccess={loadTheory}
        />
      )}

      <ReportForm
        open={isTheoryReportModalOpen}
        onOpenChange={setIsTheoryReportModalOpen}
        targetId={theory.id}
        targetType="theory"
      />
    </div>
  );
}