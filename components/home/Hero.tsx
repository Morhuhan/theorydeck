// components/home/Hero.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export function Hero() {
  return (
    <div className="py-12 text-center space-y-6">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Доказательные дискуссии
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Исследуйте теории, добавляйте доказательства, голосуйте за силу аргументов. 
        Узнайте, что думает сообщество на основе фактов, а не эмоций.
      </p>
      <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Найти теорию..."
            className="pl-10 h-12 text-base"
          />
        </div>

      </div>
    </div>
  );
}