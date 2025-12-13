// components/theory/TheoryList.tsx
"use client";

import { TheoryCard } from "./TheoryCard";

const mockTheories = [
  {
    slug: "ai-will-replace-programmers",
    title: "ИИ полностью заменит программистов к 2030 году",
    tldr: "Развитие LLM приведёт к тому, что традиционное программирование станет ненужным.",
    realm: "Технологии",
    topic: "ИИ",
    tags: ["AI", "Программирование", "Будущее работы"],
    status: "ACTIVE",
    forPercent: 35,
    cardCount: 6,
    commentCount: 47,
  },
  {
    slug: "remote-work-more-productive",
    title: "Удалённая работа продуктивнее офисной",
    tldr: "Исследования показывают, что сотрудники на удалёнке работают эффективнее и меньше выгорают.",
    realm: "Бизнес",
    topic: "HR",
    tags: ["Удалёнка", "Продуктивность", "Офис"],
    status: "ACTIVE",
    forPercent: 62,
    cardCount: 12,
    commentCount: 89,
  },
  {
    slug: "electric-cars-not-green",
    title: "Электромобили не экологичнее бензиновых",
    tldr: "Если учесть производство батарей и источники электроэнергии, углеродный след сопоставим.",
    realm: "Экология",
    topic: "Транспорт",
    tags: ["Электромобили", "CO2", "Энергетика"],
    status: "ACTIVE",
    forPercent: 28,
    cardCount: 18,
    commentCount: 156,
  },
  {
    slug: "crypto-future-of-finance",
    title: "Криптовалюты заменят традиционные финансы",
    tldr: "Децентрализованные финансы неизбежно вытеснят банки и традиционные платёжные системы.",
    realm: "Финансы",
    topic: "Крипто",
    tags: ["Bitcoin", "DeFi", "Банки"],
    status: "ACTIVE",
    forPercent: 41,
    cardCount: 24,
    commentCount: 203,
  },
  {
    slug: "social-media-mental-health",
    title: "Соцсети разрушают ментальное здоровье молодёжи",
    tldr: "Корреляция между использованием соцсетей и депрессией/тревожностью у подростков доказана.",
    realm: "Общество",
    topic: "Психология",
    tags: ["Соцсети", "Депрессия", "Подростки"],
    status: "ACTIVE",
    forPercent: 71,
    cardCount: 15,
    commentCount: 94,
  },
  {
    slug: "nuclear-energy-safest",
    title: "Атомная энергетика — самый безопасный источник энергии",
    tldr: "По числу смертей на единицу произведённой энергии ядерная энергетика безопаснее всех альтернатив.",
    realm: "Экология",
    topic: "Энергетика",
    tags: ["Атом", "Безопасность", "Статистика"],
    status: "ACTIVE",
    forPercent: 68,
    cardCount: 9,
    commentCount: 67,
  },
];

export function TheoryList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mockTheories.map((theory) => (
        <TheoryCard key={theory.slug} {...theory} />
      ))}
    </div>
  );
}