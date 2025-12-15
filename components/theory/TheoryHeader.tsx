// components/theory/TheoryHeader.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ReportButton } from "./ReportButton";

interface TheoryHeaderProps {
  title: string;
  realm?: string | null;
  topic?: string | null;
  tags: string[];
  status: string;
  theoryId: string;
  onReportClick: () => void;
}

export function TheoryHeader({
  title,
  realm,
  topic,
  tags,
  status,
  theoryId,
  onReportClick,
}: TheoryHeaderProps) {
  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReportClick();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold break-words">{title}</h1>
          {realm && topic && (
            <p className="text-lg text-muted-foreground">
              {realm} • {topic}
            </p>
          )}
        </div>
        <div onClick={handleReportClick}>
          <ReportButton
            targetId={theoryId}
            targetType="THEORY"
            onReport={handleReportClick}
          />
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}