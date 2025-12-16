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
    <div className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-br from-[#0079bf] via-[#0079bf] to-[#026aa7]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Доказательные дискуссии
        </h1>
        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Исследуйте теории, добавляйте доказательства, голосуйте за силу аргументов.
        </p>
        
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Поиск теорий..."
              className="pl-12 h-12 text-base bg-white shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-white/50"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}