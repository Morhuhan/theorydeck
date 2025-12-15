// components/theory/TheoryCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, User, BarChart } from "lucide-react";
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
  forPercent?: number;
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
  forPercent = undefined,
}: TheoryCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReportModalOpen(true);
  };

  return (
    <>
      <Link href={`/theory/${slug}`} className="block h-full group">
        <Card className="hover:shadow-lg transition-all h-full flex flex-col cursor-pointer hover:border-primary/50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 flex-1 min-w-0">
                {/* Убрана анимация цвета при наведении */}
                <h3 className="font-bold text-xl break-words overflow-hidden text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                {realm && topic && (
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="secondary" className="bg-white/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-xs">
                      {realm}
                    </Badge>
                    <span className="text-emerald-400">•</span>
                    <Badge variant="secondary" className="bg-white/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-xs">
                      {topic}
                    </Badge>
                  </div>
                )}
              </div>
              <div onClick={handleReportClick} className="flex-shrink-0">
                <ReportButton 
                  targetId={id}
                  targetType="THEORY"
                  onReport={handleReportClick}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <CardContent className="space-y-4 flex-1 pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Утверждение:
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 break-words overflow-hidden line-clamp-3">
                {claim}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                TL;DR
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words overflow-hidden line-clamp-3">
                {tldr}
              </p>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs break-words overflow-hidden max-w-full bg-gray-100/70 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-3 pb-3 flex items-center justify-between text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-1 bg-gray-200/70 dark:bg-gray-700/50 rounded">
                  <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="truncate max-w-[100px] font-medium text-gray-700 dark:text-gray-300">
                  {authorName || "Аноним"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-gray-200/70 dark:bg-gray-700/50 rounded">
                  <Calendar className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {new Date(createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-gray-200/70 dark:bg-gray-700/50 rounded">
                  <MessageSquare className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {evidenceCount}
                </span>
              </div>
            </div>
            
            {forPercent !== undefined && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                <BarChart className="h-3 w-3" />
                <span className="font-bold whitespace-nowrap">
                  {Math.round(forPercent)}%
                </span>
              </div>
            )}
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