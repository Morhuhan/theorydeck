// components/theory/EvidenceCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp } from "lucide-react";

export type Stance = "FOR" | "AGAINST";

interface EvidenceCardProps {
  id: string;
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: Stance;
  voteCount: number;
  averageStrength: number;
  authorName?: string;
}

export function EvidenceCard({
  content,
  source,
  sourceTitle,
  context,
  stance,
  voteCount,
  averageStrength,
  authorName,
}: EvidenceCardProps) {
  const stanceColor = stance === "FOR" 
    ? "border-l-green-500" 
    : "border-l-red-500";

  const stanceBg = stance === "FOR"
    ? "bg-green-500/5"
    : "bg-red-500/5";

  return (
    <Card className={`border-l-4 ${stanceColor} ${stanceBg}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant={stance === "FOR" ? "default" : "destructive"}>
            {stance === "FOR" ? "За" : "Против"}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{averageStrength.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm">{content}</p>
        
        {context && (
          <p className="text-xs text-muted-foreground italic">{context}</p>
        )}
        
        {source && (
          <a 
            href={source} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {sourceTitle || "Источник"}
          </a>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{authorName || "Аноним"}</span>
        <span>{voteCount} оценок</span>
      </CardFooter>
    </Card>
  );
}