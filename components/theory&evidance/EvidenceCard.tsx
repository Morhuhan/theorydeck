// components/theory/EvidenceCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp, Flag, User } from "lucide-react";
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
}: EvidenceCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReportClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsReportModalOpen(true);
  };

  const safeAverageStrength = typeof averageStrength === 'number' && !isNaN(averageStrength) 
    ? averageStrength 
    : 0;

  return (
    <>
      <Card 
        className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 border-0 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={stance === "FOR" ? "default" : "destructive"} 
                className={`text-xs font-semibold ${
                  stance === "FOR" 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stance === "FOR" ? "ЗА" : "ПРОТИВ"}
              </Badge>
              
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{safeAverageStrength.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400">/10</span>
              </div>
            </div>
            
            <div 
              onClick={handleReportClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <ReportButton 
                targetId={id}
                targetType="EVIDENCE"
                onReport={handleReportClick}
              />
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
          
          {/* Context */}
          {context && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border-l-2 border-amber-400 dark:border-amber-600 rounded">
              <p className="text-xs text-amber-800 dark:text-amber-300 italic leading-relaxed">
                {context}
              </p>
            </div>
          )}
          
          {/* Source Link */}
          {source && (
            <a 
              href={source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#0079bf] hover:text-[#026aa7] dark:text-[#4a9eff] dark:hover:text-[#6bb3ff] hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate max-w-[200px]">
                {sourceTitle || "Источник"}
              </span>
            </a>
          )}

          {/* Vote Strength */}
          {authorId && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <VoteStrength 
                cardId={id}
                cardAuthorId={authorId}
                currentVote={userVote}
                onVoteUpdate={onVoteUpdate}
              />
            </div>
          )}
        </CardContent>
        
        {/* Footer */}
        <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between w-full text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium truncate max-w-[120px]">
                {authorName || "Аноним"}
              </span>
            </div>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <ThumbsUp className="h-3 w-3" />
              {voteCount}
            </span>
          </div>
        </CardFooter>
      </Card>

      <ReportForm
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        targetId={id}
        targetType="card"
      />
    </>
  );
}