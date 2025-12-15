// components/home/Hero.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Hero({ onSearch, searchQuery = "" }: HeroProps) {
  return (
    <div 
      className="relative py-16 text-center space-y-6 overflow-hidden"
      style={{
        backgroundImage: "url('/123.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Затемнение для лучшей читаемости текста */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Контент поверх фона */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
          Доказательные дискуссии
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mt-4">
          Исследуйте теории, добавляйте доказательства, голосуйте за силу аргументов. 
          Узнайте, что думает сообщество на основе фактов, а не эмоций.
        </p>
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mt-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="🔍 Найти теорию..."
              className="pl-5 h-12 text-base bg-white/95 backdrop-blur-sm border-white/20"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}