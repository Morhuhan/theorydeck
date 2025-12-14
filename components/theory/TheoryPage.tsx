// components/theory/TheoryPage.tsx
"use client";

import { useState } from "react";
import { TheoryHeader } from "./TheoryHeader";
import { TheoryTLDR } from "./TheoryTLDR";
import { ConfidenceBar } from "./ConfidenceBar";
import { TopEvidence } from "./TopEvidence";
import { AllEvidence } from "./AllEvidence";
import { Separator } from "@/components/ui/separator";
import { EvidenceForm } from "@/components/forms/EvidenceForm";

const mockTheories: Record<string, {
  id: string;
  slug: string;
  title: string;
  claim: string;
  tldr: string;
  status: string;
  realm: string;
  topic: string;
  tags: string[];
}> = {
  "ai-will-replace-programmers": {
    id: "1",
    slug: "ai-will-replace-programmers",
    title: "ИИ полностью заменит программистов к 2030 году",
    claim: "Развитие больших языковых моделей и AI-ассистентов приведёт к тому, что традиционное программирование станет ненужным, и профессия программиста исчезнет.",
    tldr: "С появлением GPT-4, Claude и подобных моделей многие задачи программирования автоматизируются. Сторонники считают, что через 5-7 лет ИИ сможет писать код лучше людей. Критики указывают на ограничения моделей и необходимость человеческого контроля.",
    status: "ACTIVE",
    realm: "Технологии",
    topic: "ИИ",
    tags: ["AI", "Программирование", "Будущее работы"],
  },
  "remote-work-more-productive": {
    id: "2",
    slug: "remote-work-more-productive",
    title: "Удалённая работа продуктивнее офисной",
    claim: "Сотрудники, работающие из дома, демонстрируют более высокую продуктивность и удовлетворённость работой по сравнению с офисными работниками.",
    tldr: "Исследования показывают рост продуктивности на 13-20% при удалённой работе. Экономия времени на дорогу и гибкий график позволяют лучше балансировать работу и жизнь.",
    status: "ACTIVE",
    realm: "Бизнес",
    topic: "HR",
    tags: ["Удалёнка", "Продуктивность", "Офис"],
  },
};

const defaultTheory = mockTheories["ai-will-replace-programmers"];

const mockForCards = [
  {
    id: "1",
    content: "GPT-4 уже может решать задачи на LeetCode уровня Hard с точностью 80%. Темпы улучшения показывают, что через несколько лет ИИ превзойдёт среднего программиста.",
    source: "https://arxiv.org/example",
    sourceTitle: "Arxiv: LLM Coding Capabilities",
    context: "Исследование проведено на 500 задачах разной сложности",
    stance: "FOR" as const,
    voteCount: 42,
    averageStrength: 7.2,
    authorName: "TechAnalyst",
  },
  {
    id: "2",
    content: "Крупные компании уже сокращают наём джуниор-разработчиков, делая ставку на AI-ассистентов для рутинных задач.",
    stance: "FOR" as const,
    voteCount: 28,
    averageStrength: 6.1,
    authorName: "IndustryWatcher",
  },
  {
    id: "3",
    content: "Devin от Cognition показал возможность автономного выполнения сложных задач разработки от начала до конца.",
    source: "https://cognition.ai/devin",
    sourceTitle: "Cognition AI Blog",
    stance: "FOR" as const,
    voteCount: 35,
    averageStrength: 5.8,
    authorName: "AIEnthusiast",
  },
];

const mockAgainstCards = [
  {
    id: "4",
    content: "ИИ не понимает бизнес-контекст и не может принимать архитектурные решения. Программирование — это не только написание кода, но и понимание требований, коммуникация с заказчиком.",
    stance: "AGAINST" as const,
    voteCount: 56,
    averageStrength: 8.1,
    authorName: "SeniorDev",
  },
  {
    id: "5",
    content: "LLM галлюцинируют и генерируют код с уязвимостями. В критичных системах (медицина, финансы, авиация) это недопустимо.",
    source: "https://security-research.example",
    sourceTitle: "Security Research Paper",
    context: "Анализ 1000 фрагментов кода, сгенерированных ChatGPT",
    stance: "AGAINST" as const,
    voteCount: 48,
    averageStrength: 7.8,
    authorName: "SecurityExpert",
  },
  {
    id: "6",
    content: "Предыдущие предсказания о 'конце программирования' (CASE tools в 90-х, no-code в 2010-х) не сбылись. Сложность софта растёт быстрее возможностей автоматизации.",
    stance: "AGAINST" as const,
    voteCount: 38,
    averageStrength: 6.9,
    authorName: "HistoryBuff",
  },
];

interface TheoryPageProps {
  slug?: string;
}

export function TheoryPage({ slug }: TheoryPageProps) {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  
  const theory = slug ? (mockTheories[slug] || defaultTheory) : defaultTheory;
  
  const forScore = mockForCards.reduce((sum, card) => sum + card.averageStrength * card.voteCount, 0);
  const againstScore = mockAgainstCards.reduce((sum, card) => sum + card.averageStrength * card.voteCount, 0);

  const topFor = [...mockForCards].sort((a, b) => b.averageStrength - a.averageStrength).slice(0, 3);
  const topAgainst = [...mockAgainstCards].sort((a, b) => b.averageStrength - a.averageStrength).slice(0, 3);

  const handleCardAdded = () => {
    setIsAddCardOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <TheoryHeader
        title={theory.title}
        realm={theory.realm}
        topic={theory.topic}
        tags={theory.tags}
        status={theory.status}
      />

      <TheoryTLDR claim={theory.claim} tldr={theory.tldr} />

      <ConfidenceBar forScore={forScore} againstScore={againstScore} />

      <Separator />

      <div className="grid md:grid-cols-2 gap-8">
        <TopEvidence title="Топ аргументы ЗА" stance="FOR" cards={topFor} />
        <TopEvidence title="Топ аргументы ПРОТИВ" stance="AGAINST" cards={topAgainst} />
      </div>

      <Separator />

      <AllEvidence
        forCards={mockForCards}
        againstCards={mockAgainstCards}
        onAddCard={() => setIsAddCardOpen(true)}
      />

      <EvidenceForm 
        theoryId={theory.id}
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        onSuccess={handleCardAdded}
      />
    </div>
  );
}