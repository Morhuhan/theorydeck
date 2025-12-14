// components/forms/EvidenceForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EvidenceFormProps {
  theoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EvidenceForm({ onSuccess, onCancel }: EvidenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stance, setStance] = useState<"FOR" | "AGAINST">("FOR");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual evidence creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Карточка добавлена (заглушка)");
    setIsLoading(false);
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Приведите факт, исследование или аргумент в поддержку или против теории
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Позиция *</Label>
            <RadioGroup
              value={stance}
              onValueChange={(value) => setStance(value as "FOR" | "AGAINST")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FOR" id="for" />
                <Label htmlFor="for" className="text-green-600 font-medium cursor-pointer">
                  За теорию
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AGAINST" id="against" />
                <Label htmlFor="against" className="text-red-600 font-medium cursor-pointer">
                  Против теории
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Содержание *</Label>
            <Textarea
              id="content"
              placeholder="Опишите доказательство или аргумент..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Чётко изложите факт или аргумент. Избегайте эмоций и личных мнений.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Источник (URL)</Label>
            <Input
              id="source"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceTitle">Название источника</Label>
            <Input
              id="sourceTitle"
              placeholder="Например: Nature, Arxiv, BBC News"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Контекст</Label>
            <Textarea
              id="context"
              placeholder="Дополнительный контекст: когда, где, при каких условиях..."
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Добавление..." : "Добавить карточку"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}