// components/forms/ReportForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "theory" | "card";
  targetId?: string;
}

const REPORT_REASONS = [
  { value: "SPAM", label: "Спам" },
  { value: "MISINFORMATION", label: "Дезинформация" },
  { value: "INAPPROPRIATE", label: "Неприемлемый контент" },
  { value: "SPOILER", label: "Спойлер" },
  { value: "LEAK", label: "Утечка информации" },
  { value: "DUPLICATE", label: "Дубликат" },
  { value: "OTHER", label: "Другое" },
];

export function ReportForm({ open, onOpenChange, targetType }: ReportFormProps) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const targetLabels = {
    theory: "теорию",
    card: "карточку",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsLoading(true);

    // TODO: Implement actual report submission
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert("Жалоба отправлена (заглушка)");
    setIsLoading(false);
    setReason("");
    setDetails("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пожаловаться на {targetLabels[targetType]}</DialogTitle>
          <DialogDescription>
            Опишите причину жалобы. Модераторы рассмотрят её в ближайшее время.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Причина жалобы *</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Подробности</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !reason}>
              {isLoading ? "Отправка..." : "Отправить жалобу"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}