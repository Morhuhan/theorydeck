// components/forms/TheoryForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const REALMS = [
  "Технологии",
  "Бизнес",
  "Наука",
  "Общество",
  "Политика",
  "Экология",
  "Финансы",
  "Здоровье",
  "Культура",
  "Спорт",
];

export function TheoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual theory creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Теория создана (заглушка)");
    setIsLoading(false);
    router.push("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новая теория</CardTitle>
        <CardDescription>
          Сформулируйте теорию чётко и конкретно. Хорошая теория — это проверяемое утверждение.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок теории *</Label>
            <Input
              id="title"
              placeholder="Например: ИИ заменит программистов к 2030 году"
              required
            />
            <p className="text-xs text-muted-foreground">
              Краткая формулировка утверждения (до 100 символов)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim">Полная формулировка *</Label>
            <Textarea
              id="claim"
              placeholder="Развёрнутое описание того, что именно утверждается..."
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Точная формулировка теории, которую будут доказывать или опровергать
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tldr">TL;DR (краткое описание) *</Label>
            <Textarea
              id="tldr"
              placeholder="Почему эта теория обсуждается? Какой контекст важен?"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              2-3 предложения о контексте и значимости теории
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="realm">Раздел</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите раздел" />
                </SelectTrigger>
                <SelectContent>
                  {REALMS.map((realm) => (
                    <SelectItem key={realm} value={realm.toLowerCase()}>
                      {realm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Тема</Label>
              <Input id="topic" placeholder="Например: ИИ, HR, Крипто" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Теги (до 5)</Label>
            <Input
              id="tags"
              placeholder="Введите тег и нажмите Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать теорию"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}