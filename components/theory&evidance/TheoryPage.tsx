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
import { Shield, TrendingUp, BarChart3, Plus, Users, Target, Scale, CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-[#f5f6f8] dark:bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-1 sm:px-2 py-6">
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-12 w-1/3 bg-white/50 dark:bg-gray-800/50" />
            <Skeleton className="h-32 w-full bg-white/50 dark:bg-gray-800/50" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-96 bg-white/50 dark:bg-gray-800/50" />
              <Skeleton className="h-96 bg-white/50 dark:bg-gray-800/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !theory) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white dark:bg-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error ? "Ошибка" : "Теория не найдена"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Запрошенная теория не существует или была удалена"}
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-[#0079bf] hover:bg-[#026aa7] text-white"
          >
            Вернуться на главную
          </Button>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "DRAFT": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "ARCHIVED": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "RESOLVED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Активна";
      case "DRAFT": return "Черновик";
      case "ARCHIVED": return "Архив";
      case "RESOLVED": return "Решена";
      default: return "Модерируема";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge 
                className={`px-3 py-1 text-xs font-semibold ${getStatusColor(theory.status)}`}
              >
                <Target className="h-3 w-3 mr-1.5" />
                {getStatusText(theory.status)}
              </Badge>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span className="font-medium">{voteStats.totalVotes}</span>
                <span className="hidden sm:inline">голосов</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded text-sm">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">{forCards.length}</span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                <ThumbsDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                <span className="font-semibold text-red-700 dark:text-red-300">{againstCards.length}</span>
              </div>
            </div>
            
            <Button
              onClick={handleAddEvidence}
              className="bg-[#0079bf] hover:bg-[#026aa7] text-white shadow-sm w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить доказательство
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-1 sm:px-2 py-4">
        <div className="space-y-6">
          {/* Theory Header Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border-0">
            <div className="p-6 sm:p-8">
              <TheoryHeader
                title={theory.title}
                realm={theory.realm}
                topic={theory.topic}
                tags={theory.tags}
                status={theory.status}
                theoryId={theory.id}
                onReportClick={handleTheoryReportClick}
              />
              <div className="mt-6">
                <TheoryTLDR claim={theory.claim} tldr={theory.tldr} />
              </div>
            </div>
          </Card>

          {/* Confidence Bar Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border-0">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#0079bf]/10 dark:bg-[#0079bf]/20 rounded-lg">
                  <Scale className="h-5 w-5 text-[#0079bf] dark:text-[#4a9eff]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Баланс доказательств
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Общая уверенность сообщества
                  </p>
                </div>
              </div>
              
              <ConfidenceBar
                forScore={voteStats.forScore}
                againstScore={voteStats.againstScore}
                totalVotes={voteStats.totalVotes}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    {forCards.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Доказательств ЗА
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {againstCards.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Доказательств ПРОТИВ
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Evidence Columns - Trello Style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* FOR Column */}
            <div className="flex flex-col">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-t-lg px-4 py-3 border-b-2 border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      Доказательства ЗА
                    </h3>
                  </div>
                  <Badge className="bg-emerald-600 text-white dark:bg-emerald-700">
                    {forCards.length}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-emerald-50/30 dark:bg-emerald-900/10 rounded-b-lg p-4 space-y-3 min-h-[400px]">
                {topForCards.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      <TopEvidence 
                        title="" 
                        stance="FOR" 
                        cards={topForCards} 
                        onVoteUpdate={handleVoteUpdate} 
                      />
                    </div>
                    {remainingForCards.length > 0 && (
                      <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                        <AllEvidence 
                          forCards={remainingForCards} 
                          againstCards={[]} 
                          onAddCard={handleAddEvidence}
                          onVoteUpdate={handleVoteUpdate}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Пока нет доказательств ЗА</p>
                  </div>
                )}
              </div>
            </div>

            {/* AGAINST Column */}
            <div className="flex flex-col">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-t-lg px-4 py-3 border-b-2 border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      Доказательства ПРОТИВ
                    </h3>
                  </div>
                  <Badge className="bg-red-600 text-white dark:bg-red-700">
                    {againstCards.length}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-red-50/30 dark:bg-red-900/10 rounded-b-lg p-4 space-y-3 min-h-[400px]">
                {topAgainstCards.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      <TopEvidence 
                        title="" 
                        stance="AGAINST" 
                        cards={topAgainstCards} 
                        onVoteUpdate={handleVoteUpdate} 
                      />
                    </div>
                    {remainingAgainstCards.length > 0 && (
                      <div className="pt-3 border-t border-red-200 dark:border-red-800">
                        <AllEvidence 
                          forCards={[]} 
                          againstCards={remainingAgainstCards} 
                          onAddCard={handleAddEvidence}
                          onVoteUpdate={handleVoteUpdate}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Пока нет доказательств ПРОТИВ</p>
                  </div>
                )}
              </div>
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