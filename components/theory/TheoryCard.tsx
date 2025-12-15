// components/theory/TheoryCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, User, BarChart } from "lucide-react";
import { ReportButton } from "./ReportButton";
import { ReportModal } from "@/components/reports/ReportModal";
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
  forPercent = 0,
}: TheoryCardProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportSubmit = () => {
    console.log(`Report submitted for theory ${id}`);
    setIsReportModalOpen(false);
  };

  return (
    <>
      <Link href={`/theories/${slug}`} className="block h-full">
        <Card className="hover:shadow-md transition-all h-full flex flex-col cursor-pointer hover:border-primary/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-lg break-words">{title}</h3>
                </div>
                {realm && topic && (
                  <p className="text-sm text-muted-foreground break-words">
                    {realm} • {topic}
                  </p>
                )}
              </div>
              <ReportButton 
                targetId={id}
                targetType="THEORY"
                onReport={() => setIsReportModalOpen(true)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 flex-1">
            <div>
              <h4 className="text-sm font-medium mb-1">Утверждение:</h4>
              <p className="text-sm text-muted-foreground break-words line-clamp-3">{claim}</p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm break-words line-clamp-3">{tldr}</p>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs break-words">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{authorName || "Аноним"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{new Date(createdAt).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 flex-shrink-0" />
                <span>{evidenceCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{forPercent}% за</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>

      <ReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        targetId={id}
        targetType="THEORY"
        targetContent={title}
        onReportSubmit={handleReportSubmit}
      />
    </>
  );
}