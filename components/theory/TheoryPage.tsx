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
import { Shield, TrendingUp, BarChart3, Sparkles, Users, Target, Scale, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

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

  const handleTheoryReportClick = () => {
    setIsTheoryReportModalOpen(true);
  };

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !theory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error ? "Ошибка" : "Теория не найдена"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Запрошенная теория не существует или была удалена"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Вернуться на главную
          </button>
        </Card>
      </div>
    );
  }

  const forCards = mapEvidenceCards(filterCardsByStance(theory.evidenceCards, "FOR"));
  const againstCards = mapEvidenceCards(filterCardsByStance(theory.evidenceCards, "AGAINST"));
  const voteStats = calculateVoteStats(theory.evidenceCards);

  const topForCards = forCards.slice(0, 3);
  const topAgainstCards = againstCards.slice(0, 3);

  const topCardIds = new Set([
    ...topForCards.map(card => card.id),
    ...topAgainstCards.map(card => card.id)
  ]);

  const remainingForCards = forCards.filter(card => !topCardIds.has(card.id));
  const remainingAgainstCards = againstCards.filter(card => !topCardIds.has(card.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/5 dark:to-blue-500/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50"
            >
              <Target className="h-3 w-3 mr-1.5" />
              {theory.status === "ACTIVE" ? "Активна" : 
               theory.status === "DRAFT" ? "Черновик" : 
               theory.status === "ARCHIVED" ? "Архив" : 
               theory.status === "RESOLVED" ? "Решена" : "Модерируема"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{voteStats.totalVotes} голосов</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-300/50 dark:border-gray-600/50">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-8">
              <TheoryHeader
                title={theory.title}
                realm={theory.realm}
                topic={theory.topic}
                tags={theory.tags}
                status={theory.status}
                theoryId={theory.id}
                onReportClick={handleTheoryReportClick}
              />
            </div>
            
            <div className="px-8 pb-8">
              <TheoryTLDR claim={theory.claim} tldr={theory.tldr} />
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                  <Scale className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Баланс доказательств</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Общая уверенность сообщества</p>
                </div>
              </div>
              
              <ConfidenceBar
                forScore={voteStats.forScore}
                againstScore={voteStats.againstScore}
                totalVotes={voteStats.totalVotes}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                    {forCards.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Доказательств ЗА
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-red-200/50 dark:border-red-700/50">
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300 mb-1">
                    {againstCards.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Доказательств ПРОТИВ
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/10 rounded-2xl shadow-xl border border-emerald-200/50 dark:border-emerald-700/50 overflow-hidden">
              <div className="p-6 border-b border-emerald-100 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                      <Zap className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Топ доказательств ЗА
                    </h3>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {topForCards.length}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <TopEvidence 
                  title="Топ доказательств ЗА" 
                  stance="FOR" 
                  cards={topForCards} 
                  onVoteUpdate={handleVoteUpdate} 
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-2xl shadow-xl border border-red-200/50 dark:border-red-700/50 overflow-hidden">
              <div className="p-6 border-b border-red-100 dark:border-red-800/30 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <Sparkles className="h-5 w-5 text-red-700 dark:text-red-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Топ доказательств ПРОТИВ
                    </h3>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                    {topAgainstCards.length}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <TopEvidence 
                  title="Топ доказательств ПРОТИВ" 
                  stance="AGAINST" 
                  cards={topAgainstCards} 
                  onVoteUpdate={handleVoteUpdate} 
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-8">
              <AllEvidence 
                forCards={remainingForCards} 
                againstCards={remainingAgainstCards} 
                onAddCard={handleAddEvidence}
                onVoteUpdate={handleVoteUpdate}
              />
            </div>
          </div>
        </div>
      </div>

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