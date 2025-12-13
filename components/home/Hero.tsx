// components/home/Hero.tsx
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-center gap-4">
        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Создать теорию
        </Button>
        <Button size="lg" variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Найти теорию
        </Button>
      </div>
    </div>
  );
}