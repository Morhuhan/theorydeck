// components/theory/TheoryHeader.tsx
"use client";

import { Badge } from "@/components/ui/badge";

interface TheoryHeaderProps {
  title: string;
  realm?: string;
  topic?: string;
  tags?: string[];
  status: string;
}

export function TheoryHeader({ title, realm, topic, tags = [], status }: TheoryHeaderProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
    DRAFT: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    ARCHIVED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MODERATED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {realm && <span>{realm}</span>}
        {realm && topic && <span>/</span>}
        {topic && <span>{topic}</span>}
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={statusColors[status] || statusColors.ACTIVE}>
          {status}
        </Badge>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}