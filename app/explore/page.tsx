// app/explore/page.tsx
import { TheoryList } from "@/components/theory/TheoryList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Обзор теорий</h1>
        <p className="text-muted-foreground">
          Исследуйте все теории сообщества
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск теорий..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>

      <TheoryList />
    </div>
  );
}