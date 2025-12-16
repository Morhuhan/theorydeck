// components/theory/TheoryCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, User, TrendingUp, TrendingDown } from "lucide-react";
import { ReportButton } from "./ReportButton";
import { ReportForm } from "@/components/forms/ReportForm";
import { useState } from "react";
import Link from "next/link";

interface TheoryCardProps {
  id: string;
  slug: string;
  title: string;
  claim: string;
  tldr: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "RESOLVED" | "MODERATED";
  realm?: string;
  topic?: string;
  tags: string[];
  createdAt: Date;
  authorName?: string;
  evidenceCount?: number;
  forPercent?: number | null;
}

export function TheoryCard({
  id,
  slug,
  title,
  claim,
  tldr,
  status,
  realm,
  topic,
  tags,
  createdAt,
  authorName,
  evidenceCount = 0,
  forPercent = null,
}: TheoryCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReportModalOpen(true);
  };

  const getVoteStyle = (percent: number) => {
    if (percent >= 50) {
      return {
        icon: TrendingUp,
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-700 dark:text-emerald-400",
      };
    } else {
      return {
        icon: TrendingDown,
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-700 dark:text-red-400",
      };
    }
  };

  const voteStyle = forPercent !== null && forPercent !== undefined 
    ? getVoteStyle(forPercent) 
    : null;

  return (
    <>
      <Link href={`/theory/${slug}`} className="block h-full">
        <Card 
          className="h-full flex flex-col bg-white dark:bg-gray-800 border-0 cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 hover:-translate-y-1 hover:scale-[1.02] shadow-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className="p-4 pb-3 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 flex-1 transition-colors duration-200 group-hover:text-[#0079bf]">
                {title}
              </h3>
              <div 
                onClick={handleReportClick}
                className="flex-shrink-0 transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                <ReportButton 
                  targetId={id}
                  targetType="THEORY"
                  onReport={handleReportClick}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                />
              </div>
            </div>
            
            {(realm || topic) && (
              <div className="flex items-center gap-2 flex-wrap">
                {realm && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium transition-colors duration-200"
                  >
                    {realm}
                  </Badge>
                )}
                {topic && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium transition-colors duration-200"
                  >
                    {topic}
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="px-4 pb-4 space-y-3 flex-1">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {claim}
              </p>
            </div>
            
            <div 
              className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-[#0079bf] transition-all duration-300"
              style={{
                borderLeftWidth: isHovered ? '6px' : '4px',
                backgroundColor: isHovered 
                  ? 'rgb(0, 121, 191, 0.05)' 
                  : undefined
              }}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {tldr}
              </p>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 py-0.5 transition-colors duration-200"
                  >
                    #{tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-2 py-0.5"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between w-full text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[80px] font-medium">
                    {authorName || "Аноним"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="font-medium">{evidenceCount}</span>
                </div>
              </div>
              
              {voteStyle && forPercent !== null && (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${voteStyle.bgColor} ${voteStyle.textColor} transition-all duration-300`}>
                  <voteStyle.icon className="h-3.5 w-3.5" />
                  <span className="font-bold">
                    {Math.round(forPercent)}%
                  </span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>

      <ReportForm
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        targetId={id}
        targetType="theory"
      />
    </>
  );
}