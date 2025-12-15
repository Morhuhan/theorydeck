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
import { TagInput } from "@/components/ui/tag-input";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const theoryData = {
      title: formData.get("title") as string,
      claim: formData.get("claim") as string,
      tldr: formData.get("tldr") as string,
      realm: formData.get("realm") as string || null,
      topic: formData.get("topic") as string || null,
      tags,
    };

    try {
      const response = await fetch("/api/theories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(theoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании теории");
      }

      router.push(`/theory/${data.slug}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
      setIsLoading(false);
    }
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
              name="title"
              placeholder="Например: ИИ заменит программистов к 2030 году"
              required
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Краткая формулировка утверждения (до 100 символов)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="claim">Полная формулировка *</Label>
            <Textarea
              id="claim"
              name="claim"
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
              name="tldr"
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
              <Select name="realm">
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
              <Input id="topic" name="topic" placeholder="Например: ИИ, HR, Крипто" />
            </div>
          </div>

          <TagInput
            tags={tags}
            onTagsChange={setTags}
            maxTags={5}
            placeholder="Введите тег и нажмите Enter"
            helpText="Добавьте релевантные теги для поиска"
          />

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