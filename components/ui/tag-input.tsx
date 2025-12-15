// components/ui/tag-input.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  label?: string;
  placeholder?: string;
  helpText?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  maxTags = 5,
  label = "Теги",
  placeholder = "Введите тег и нажмите Enter",
  helpText,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) return;
    if (tags.includes(trimmedInput)) {
      setInput("");
      return;
    }
    if (tags.length >= maxTags) {
      setInput("");
      return;
    }

    onTagsChange([...tags, trimmedInput]);
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label} (до {maxTags})</Label>}
      
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />

      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive transition-colors"
                aria-label={`Удалить тег ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}