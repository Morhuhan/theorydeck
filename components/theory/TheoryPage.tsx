"use client";

import { TheoryCard } from "./TheoryCard";
import { ReportButton } from "./ReportButton";
import { ReportModal } from "@/components/reports/ReportModal";
import { EvidenceCard } from "./EvidenceCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";

interface TheoryPageProps {
  slug: string;
}

export function TheoryPage({ slug }: TheoryPageProps) {
  const [isTheoryReportModalOpen, setIsTheoryReportModalOpen] = useState(false);
  
  const theory = {
    id: "theory-123",
    slug: slug,
    title: "Искусственный интеллект достигнет общего интеллекта к 2030 году",
    claim: "Современные темпы развития ИИ и нейросетей позволяют прогнозировать достижение AGI (Artificial General Intelligence) к 2030 году. Экспоненциальный рост вычислительных мощностей, развитие алгоритмов глубокого обучения и появление новых архитектур нейронных сетей создают все предпосылки для этого прорыва.",
    tldr: "AGI будет достигнут к 2030 благодаря экспоненциальному росту вычислительных мощностей и алгоритмическим прорывам.",
    status: "ACTIVE" as const,
    realm: "Технологии",
    topic: "Искусственный интеллект",
    tags: ["AI", "AGI", "Futurism", "Technology", "Machine Learning"],
    createdAt: new Date("2024-01-15"),
    authorName: "Иван Петров",
    evidenceCount: 12,
    forPercent: 65,
  };

  const evidenceCards = [
    {
      id: "evidence-1",
      content: "Закон Мура продолжает действовать для специализированных AI-чипов. Вычислительная мощность удваивается каждые 2 года, что подтверждается последними исследованиями NVIDIA и Google.",
      source: "https://example.com/source1",
      sourceTitle: "IEEE Spectrum: AI Hardware Report 2024",
      stance: "FOR" as const,
      voteCount: 42,
      averageStrength: 8.2,
      authorName: "Алексей Смирнов",
    },
    {
      id: "evidence-2",
      content: "Текущие модели LLM демонстрируют emergent abilities, которые не были запрограммированы. Это указывает на зарождение качественно новых когнитивных способностей.",
      source: "https://example.com/source2",
      sourceTitle: "Nature: Emergent Abilities in Large Language Models",
      stance: "FOR" as const,
      voteCount: 31,
      averageStrength: 7.8,
      authorName: "Мария Ковалёва",
    },
    {
      id: "evidence-3",
      content: "AGI требует понимания причинно-следственных связей, чего современные нейросети не демонстрируют. Они лишь коррелируют паттерны в данных без реального понимания.",
      source: "https://example.com/source3",
      sourceTitle: "MIT Technology Review: The Limits of Current AI",
      stance: "AGAINST" as const,
      voteCount: 28,
      averageStrength: 6.5,
      authorName: "Дмитрий Волков",
    },
    {
      id: "evidence-4",
      content: "Инвестиции в AI исследования растут экспоненциально. В 2023 году венчурные инвестиции в AI стартапы превысили $50 млрд, что ускоряет прогресс.",
      source: "https://example.com/source4",
      sourceTitle: "Crunchbase: AI Funding Report 2023",
      stance: "FOR" as const,
      voteCount: 19,
      averageStrength: 8.9,
      authorName: "Сергей Иванов",
    },
  ];

  const relatedTheories = [
    {
      id: "theory-456",
      slug: "ai-safety-concerns",
      title: "Проблема безопасности ИИ критически недооценена",
      claim: "Риски, связанные с развитием сверхчеловеческого ИИ, требуют немедленного регулирования и исследований в области AI safety.",
      tldr: "Без должного контроля AGI может представлять экзистенциальную угрозу.",
      status: "ACTIVE" as const,
      realm: "Технологии",
      topic: "ИИ",
      tags: ["AI Safety", "Alignment", "Этика"],
      createdAt: new Date("2024-02-10"),
      authorName: "Елена Соколова",
      evidenceCount: 8,
      forPercent: 72,
    },
    {
      id: "theory-789",
      slug: "conscious-ai-impossible",
      title: "Создание сознательного ИИ принципиально невозможно",
      claim: "Сознание является фундаментальным свойством биологических систем и не может быть воспроизведено в цифровых вычислительных системах.",
      tldr: "ИИ может быть интеллектуальным, но никогда не будет сознательным.",
      status: "ACTIVE" as const,
      realm: "Философия",
      topic: "Сознание",
      tags: ["Философия", "Сознание", "Нейронауки"],
      createdAt: new Date("2024-01-28"),
      authorName: "Андрей Павлов",
      evidenceCount: 14,
      forPercent: 38,
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {theory.realm}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {theory.topic}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{theory.title}</h1>
          <p className="text-muted-foreground mt-2">
            Теория создана {new Date(theory.createdAt).toLocaleDateString("ru-RU")} • Автор: {theory.authorName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить доказательство
          </Button>
          <ReportButton
            targetId={theory.id}
            targetType="THEORY"
            variant="outline"
            size="sm"
            onReport={() => setIsTheoryReportModalOpen(true)}
          >
            Пожаловаться
          </ReportButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Утверждение</h2>
              <p className="text-muted-foreground">{theory.claim}</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p>{theory.tldr}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {theory.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Доказательства ({evidenceCards.length})</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>За: {evidenceCards.filter(e => e.stance === "FOR").length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span>Против: {evidenceCards.filter(e => e.stance === "AGAINST").length}</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {evidenceCards.map((evidence) => (
                <EvidenceCard key={evidence.id} {...evidence} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-4">Статистика</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Всего доказательств</p>
                <p className="text-2xl font-bold">{theory.evidenceCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Поддержка теории</p>
                <p className="text-2xl font-bold">{theory.forPercent}%</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${theory.forPercent}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Средняя сила аргументов</p>
                <p className="text-2xl font-bold">7.8/10</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Похожие теории</h3>
            <div className="space-y-4">
              {relatedTheories.map((relatedTheory) => (
                <div key={relatedTheory.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium">{relatedTheory.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{relatedTheory.tldr}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{relatedTheory.evidenceCount} док.</span>
                    <span>{relatedTheory.forPercent}% за</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        open={isTheoryReportModalOpen}
        onOpenChange={setIsTheoryReportModalOpen}
        targetId={theory.id}
        targetType="THEORY"
        targetContent={theory.title}
        onReportSubmit={() => {
          console.log("Theory report submitted from page");
          setIsTheoryReportModalOpen(false);
        }}
      />
    </div>
  );
}