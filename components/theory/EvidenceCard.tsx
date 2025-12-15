// components/theory/EvidenceCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp, Flag } from "lucide-react";
import { VoteStrength } from "./VoteStrength";
import { ReportButton } from "./ReportButton";
import { useState } from "react";
import { ReportForm } from "../forms";

export type Stance = "FOR" | "AGAINST";

interface EvidenceCardProps {
  id: string;
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: Stance;
  voteCount?: number;
  averageStrength?: number;
  authorName?: string;
  authorId?: string;
  userVote?: number | null;
  onVoteUpdate?: (cardId: string, newStrength: number) => void;
  isAuthenticated?: boolean;
}

export function EvidenceCard({
  id,
  content,
  source,
  sourceTitle,
  context,
  stance,
  voteCount = 0,
  averageStrength = 0,
  authorName,
  authorId,
  userVote,
  onVoteUpdate,
  isAuthenticated = false,
}: EvidenceCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const stanceColor = stance === "FOR" 
    ? "border-l-green-500" 
    : "border-l-red-500";

  const stanceBg = stance === "FOR"
    ? "bg-green-500/5"
    : "bg-red-500/5";

  const handleReportClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = () => {
    console.log(`Report submitted for evidence card ${id}`);
    setIsReportModalOpen(false);
  };

  const safeAverageStrength = typeof averageStrength === 'number' && !isNaN(averageStrength) 
    ? averageStrength 
    : 0;

  return (
    <>
      <Card className={`border-l-4 ${stanceColor} ${stanceBg} relative overflow-hidden`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={stance === "FOR" ? "default" : "destructive"} className="flex-shrink-0">
              {stance === "FOR" ? "За" : "Против"}
            </Badge>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                <span className="font-semibold">{safeAverageStrength.toFixed(1)}</span>
                <span className="text-xs">/ 10</span>
              </div>
              <div onClick={handleReportClick}>
                <ReportButton 
                  targetId={id}
                  targetType="EVIDENCE"
                  onReport={handleReportClick}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm break-all overflow-wrap-anywhere">{content}</p>
          
          {context && (
            <p className="text-xs text-muted-foreground italic break-all overflow-wrap-anywhere">{context}</p>
          )}
          
          {source && (
            <a 
              href={source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline break-all overflow-wrap-anywhere"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              <span className="break-all">{sourceTitle || "Источник"}</span>
            </a>
          )}

          {authorId && (
            <VoteStrength 
              cardId={id}
              cardAuthorId={authorId}
              currentVote={userVote}
              onVoteUpdate={onVoteUpdate}
              className="pt-2 border-t" 
            />
          )}
        </CardContent>
        
        <CardFooter className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[150px]">{authorName || "Аноним"}</span>
          <span className="whitespace-nowrap">{voteCount} {voteCount === 1 ? "оценка" : voteCount < 5 ? "оценки" : "оценок"}</span>
        </CardFooter>
      </Card>

      {isAuthenticated && (
        <ReportForm
          open={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
          targetId={id}
          targetType="card"
        />
      )}
    </>
  );
}