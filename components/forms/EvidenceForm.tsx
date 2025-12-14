// components/forms/EvidenceForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from "@/components/ui/field";

interface EvidenceFormProps {
  theoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  stance: z.enum(["FOR", "AGAINST"], {
    required_error: "Выберите позицию",
  }),
  content: z
    .string()
    .min(20, "Содержание должно содержать минимум 20 символов")
    .max(1000, "Содержание должно содержать максимум 1000 символов"),
  source: z
    .string()
    .url("Введите корректный URL")
    .optional()
    .or(z.literal("")),
  sourceTitle: z.string().optional(),
  context: z
    .string()
    .max(500, "Контекст должен содержать максимум 500 символов")
    .optional(),
});

export function EvidenceForm({ onSuccess, onCancel }: EvidenceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stance: "FOR",
      content: "",
      source: "",
      sourceTitle: "",
      context: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // TODO: Implement actual evidence creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Карточка добавлена: ${data.stance}`);
    onSuccess?.();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить доказательство</CardTitle>
        <CardDescription>
          Приведите факт, исследование или аргумент в поддержку или против теории
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="stance"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Позиция *</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FieldGroup className="flex gap-4">
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <RadioGroupItem
                        value="FOR"
                        id="stance-for"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel
                        htmlFor="stance-for"
                        className="text-green-600 font-medium cursor-pointer"
                      >
                        За теорию
                      </FieldLabel>
                    </Field>
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <RadioGroupItem
                        value="AGAINST"
                        id="stance-against"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel
                        htmlFor="stance-against"
                        className="text-red-600 font-medium cursor-pointer"
                      >
                        Против теории
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />

          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Содержание *</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Опишите доказательство или аргумент..."
                  rows={4}
                />
                <FieldDescription>
                  Чётко изложите факт или аргумент. Избегайте эмоций и личных мнений.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="source"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Источник (URL)</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://..."
                  autoComplete="url"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="sourceTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Название источника</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Например: Nature, Arxiv, BBC News"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="context"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Контекст</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Дополнительный контекст: когда, где, при каких условиях..."
                  rows={2}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Добавление..." : "Добавить карточку"}
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
