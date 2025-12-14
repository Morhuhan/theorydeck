"use client";

import { useEffect, useState } from "react";
import { TheoryHeader } from "./TheoryHeader";
import { TheoryTLDR } from "./TheoryTLDR";
import { ConfidenceBar } from "./ConfidenceBar";
import { TopEvidence } from "./TopEvidence";
import { AllEvidence } from "./AllEvidence";
import { EvidenceForm } from "@/components/forms/EvidenceForm";
import { ReportModal } from "@/components/reports/ReportModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

interface TheoryPageProps {
  slug: string;
}

export function TheoryPage({ slug }: TheoryPageProps) {
  const { data: session } = useSession();
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

  const forCards = theory.evidenceCards.filter((c: any) => c.stance === "FOR");
  const againstCards = theory.evidenceCards.filter((c: any) => c.stance === "AGAINST");

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
        forScore={forCards.reduce((sum: number, card: any) => sum + (card.voteStats?.averageStrength || 5), 0)}
        againstScore={againstCards.reduce((sum: number, card: any) => sum + (card.voteStats?.averageStrength || 5), 0)}
      />

      {session && (
        <div className="flex justify-center">
          <Button onClick={() => setIsEvidenceFormOpen(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Добавить доказательство
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <TopEvidence title="Топ доказательств ЗА" stance="FOR" cards={forCards.slice(0, 3)} />
        <TopEvidence title="Топ доказательств ПРОТИВ" stance="AGAINST" cards={againstCards.slice(0, 3)} />
      </div>

      <AllEvidence forCards={forCards} againstCards={againstCards} />

      {session && (
        <EvidenceForm
          theoryId={theory.id}
          open={isEvidenceFormOpen}
          onOpenChange={setIsEvidenceFormOpen}
          onSuccess={loadTheory}
        />
      )}

      <ReportModal
        open={isTheoryReportModalOpen}
        onOpenChange={setIsTheoryReportModalOpen}
        targetType="THEORY"
        targetId={theory.id}
      />
    </div>
  );
}
