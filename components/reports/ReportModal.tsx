// components/reports/ReportModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Flag } from "lucide-react";
import { ReportReason } from "@prisma/client";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetType: "THEORY" | "EVIDENCE";
  targetContent?: string;
  onReportSubmit?: () => void;
}

const REASONS: { value: ReportReason; label: string; description: string }[] = [
  { 
    value: "SPAM", 
    label: "Спам", 
    description: "Повторяющийся, рекламный или нерелевантный контент" 
  },
  { 
    value: "MISINFORMATION", 
    label: "Дезинформация", 
    description: "Ложная или вводящая в заблуждение информация" 
  },
  { 
    value: "INAPPROPRIATE", 
    label: "Некорректный контент", 
    description: "Оскорбительный, агрессивный или неподобающий контент" 
  },
  { 
    value: "SPOILER", 
    label: "Спойлер", 
    description: "Раскрытие важной информации без предупреждения" 
  },
  { 
    value: "LEAK", 
    label: "Утечка", 
    description: "Распространение конфиденциальной или закрытой информации" 
  },
  { 
    value: "DUPLICATE", 
    label: "Дубликат", 
    description: "Повтор существующего контента" 
  },
  { 
    value: "OTHER", 
    label: "Другое", 
    description: "Другая причина" 
  },
];

export function ReportModal({
  open,
  onOpenChange,
  targetId,
  targetType,
  targetContent,
  onReportSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason>("SPAM");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert("Пожалуйста, выберите причину жалобы");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Реальная отправка репорта
      const reportData = {
        targetId,
        targetType,
        reason: selectedReason,
        details: details || null,
        targetContent,
      };

      console.log("Отправка репорта:", reportData);
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Жалоба отправлена. Спасибо за вашу помощь в модерации!");
      
      // Сброс формы
      setSelectedReason("SPAM");
      setDetails("");
      
      // Вызов коллбэка
      onReportSubmit?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при отправке репорта:", error);
      alert("Произошла ошибка. Пожалуйста, попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReasonData = REASONS.find(r => r.value === selectedReason);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            <DialogTitle>Пожаловаться на контент</DialogTitle>
          </div>
          <DialogDescription>
            {targetType === "EVIDENCE" 
              ? "Вы собираетесь пожаловаться на доказательство"
              : "Вы собираетесь пожаловаться на теорию"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {targetContent && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Контент:</p>
                <p className="text-muted-foreground line-clamp-3">
                  {targetContent}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Причина жалобы *</Label>
              <Select
                value={selectedReason}
                onValueChange={(value) => setSelectedReason(value as ReportReason)}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Выберите причину" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div className="flex flex-col">
                        <span>{reason.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {reason.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">
                Дополнительные детали
                <span className="text-muted-foreground font-normal"> (опционально)</span>
              </Label>
              <Textarea
                id="details"
                placeholder="Укажите дополнительные детали, которые помогут модераторам..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Важная информация</p>
                  <p className="text-amber-700 mt-1">
                    Жалобы рассматриваются модераторами в течение 24 часов. 
                    Пожалуйста, убедитесь, что ваш репорт соответствует выбранной причине.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  Отправить жалобу
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}