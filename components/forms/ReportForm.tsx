// components/forms/ReportForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";

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

const formSchema = z.object({
  reason: z.string().min(1, "Пожалуйста, выберите причину жалобы"),
  details: z.string().optional(),
});

export function ReportForm({ open, onOpenChange, targetType }: ReportFormProps) {
  const targetLabels = {
    theory: "теорию",
    card: "карточку",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      details: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // TODO: Implement actual report submission
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Жалоба отправлена: ${data.reason}`);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пожаловаться на {targetLabels[targetType]}</DialogTitle>
          <DialogDescription>
            Опишите причину жалобы. Модераторы рассмотрят её в ближайшее время.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="reason"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Причина жалобы *</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FieldGroup>
                    {REPORT_REASONS.map((r) => (
                      <Field
                        key={r.value}
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <RadioGroupItem
                          value={r.value}
                          id={`report-reason-${r.value}`}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldLabel
                          htmlFor={`report-reason-${r.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {r.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />

          <Controller
            name="details"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Подробности</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Дополнительная информация..."
                  rows={3}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? "Отправка..." : "Отправить жалобу"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
