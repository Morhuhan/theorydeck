// components/forms/TheoryForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

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

const formSchema = z.object({
  title: z
    .string()
    .min(10, "Заголовок должен содержать минимум 10 символов")
    .max(100, "Заголовок должен содержать максимум 100 символов"),
  claim: z
    .string()
    .min(20, "Формулировка должна содержать минимум 20 символов")
    .max(500, "Формулировка должна содержать максимум 500 символов"),
  tldr: z
    .string()
    .min(20, "Описание должно содержать минимум 20 символов")
    .max(300, "Описание должно содержать максимум 300 символов"),
  realm: z.string().min(1, "Выберите раздел"),
  topic: z.string().optional(),
  tags: z.array(z.string()).max(5, "Максимум 5 тегов"),
});

export function TheoryForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      claim: "",
      tldr: "",
      realm: "",
      topic: "",
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // TODO: Implement actual theory creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Теория создана: ${data.title}`);
    router.push("/");
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim()) {
      e.preventDefault();
      const tags = form.getValues("tags");
      if (!tags.includes(target.value.trim()) && tags.length < 5) {
        append(target.value.trim());
      }
      target.value = "";
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Заголовок теории *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Например: ИИ заменит программистов к 2030 году"
                />
                <FieldDescription>
                  Краткая формулировка утверждения (до 100 символов)
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="claim"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Полная формулировка *</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Развёрнутое описание того, что именно утверждается..."
                  rows={3}
                />
                <FieldDescription>
                  Точная формулировка теории, которую будут доказывать или опровергать
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="tldr"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>TL;DR (краткое описание) *</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Почему эта теория обсуждается? Какой контекст важен?"
                  rows={3}
                />
                <FieldDescription>
                  2-3 предложения о контексте и значимости теории
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="realm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Раздел *</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="topic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Тема</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Например: ИИ, HR, Крипто"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Field>
            <FieldLabel htmlFor="tag-input">Теги (до 5)</FieldLabel>
            <Input
              id="tag-input"
              placeholder="Введите тег и нажмите Enter"
              onKeyDown={handleAddTag}
            />
            {fields.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {fields.map((field, index) => {
                  const tagValue = form.watch(`tags.${index}`);
                  return (
                    <Badge key={field.id} variant="secondary" className="gap-1">
                      {tagValue}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </Field>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Создание..." : "Создать теорию"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
