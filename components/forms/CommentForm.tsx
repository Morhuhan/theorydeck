// components/forms/CommentForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  parentId?: string;
  onSubmit?: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = "Напишите комментарий..." 
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);

    // TODO: Implement actual comment creation
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit?.(content);
    setContent("");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isLoading || !content.trim()}>
          {isLoading ? "Отправка..." : "Отправить"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}