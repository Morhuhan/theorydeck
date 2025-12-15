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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "theory" | "card";
  targetId: string;
}

const REPORT_REASONS = [
  { 
    value: "SPAM", 
    label: "Спам",
    description: "Нежелательный или рекламный контент"
  },
  { 
    value: "MISINFORMATION", 
    label: "Дезинформация",
    description: "Ложная или вводящая в заблуждение информация"
  },
  { 
    value: "INAPPROPRIATE", 
    label: "Неприемлемый контент",
    description: "Оскорбительный или неуместный материал"
  },
  { 
    value: "SPOILER", 
    label: "Спойлер",
    description: "Раскрытие важных сюжетных деталей"
  },
  { 
    value: "LEAK", 
    label: "Утечка информации",
    description: "Неавторизованное раскрытие конфиденциальной информации"
  },
  { 
    value: "DUPLICATE", 
    label: "Дубликат",
    description: "Повторяющийся контент"
  },
  { 
    value: "OTHER", 
    label: "Другое",
    description: "Иная причина"
  },
];

export function ReportForm({ open, onOpenChange, targetType, targetId }: ReportFormProps) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const targetLabels = {
    theory: "теорию",
    card: "карточку",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsLoading(true);
    setError(null);

    const reportData = {
      reason,
      details: details || null,
      theoryId: targetType === "theory" ? targetId : null,
      cardId: targetType === "card" ? targetId : null,
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при отправке жалобы");
      }

      setSuccess(true);
      setReason("");
      setDetails("");
      
      // Закрыть диалог через 2 секунды
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDetails("");
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Пожаловаться на {targetLabels[targetType]}</DialogTitle>
          <DialogDescription>
            Опишите причину жалобы. Модераторы рассмотрят её в ближайшее время.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Жалоба успешно отправлена. Спасибо за помощь в модерации!
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Label className="text-base">Причина жалобы *</Label>
              <RadioGroup value={reason} onValueChange={setReason}>
                <div className="space-y-3">
                  {REPORT_REASONS.map((r) => (
                    <div
                      key={r.value}
                      className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        reason === r.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setReason(r.value)}
                    >
                      <RadioGroupItem 
                        value={r.value} 
                        id={r.value}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <Label 
                          htmlFor={r.value} 
                          className="cursor-pointer font-medium text-base"
                        >
                          {r.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="details" className="text-base">
                Подробности {reason === "OTHER" && "(обязательно для причины 'Другое')"}
              </Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Опишите подробнее причину жалобы..."
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Предоставьте дополнительную информацию, которая поможет модераторам
                принять правильное решение.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !reason || (reason === "OTHER" && !details.trim())}
              >
                {isLoading ? "Отправка..." : "Отправить жалобу"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}