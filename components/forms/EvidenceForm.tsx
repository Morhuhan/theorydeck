// components/forms/EvidenceForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EvidenceFormProps {
  theoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EvidenceForm({ theoryId, open, onOpenChange, onSuccess }: EvidenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stance, setStance] = useState<"FOR" | "AGAINST">("FOR");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const evidenceData = {
      theoryId,
      stance,
      content: formData.get("content") as string,
      source: formData.get("source") as string || null,
      sourceTitle: formData.get("sourceTitle") as string || null,
      context: formData.get("context") as string || null,
    };

    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evidenceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при добавлении доказательства");
      }

      onOpenChange(false);
      onSuccess?.();
      e.currentTarget.reset();
      setStance("FOR");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Добавить доказательство</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Приведите факт, исследование или аргумент в поддержку или против теории
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
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
                name="content"
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
                name="source"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceTitle">Название источника</Label>
              <Input
                id="sourceTitle"
                name="sourceTitle"
                placeholder="Например: Nature, Arxiv, BBC News"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Контекст</Label>
              <Textarea
                id="context"
                name="context"
                placeholder="Дополнительный контекст: когда, где, при каких условиях..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Добавление..." : "Добавить карточку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}