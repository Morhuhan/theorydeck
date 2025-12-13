// components/theory/TheoryCard.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users } from "lucide-react";

interface TheoryCardProps {
  slug: string;
  title: string;
  tldr: string;
  realm?: string;
  topic?: string;
  tags?: string[];
  status: string;
  forPercent: number;
  cardCount: number;
  commentCount: number;
}

export function TheoryCard({
  slug,
  title,
  tldr,
  realm,
  topic,
  tags = [],
  status,
  forPercent,
  cardCount,
  commentCount,
}: TheoryCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
    DRAFT: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    ARCHIVED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MODERATED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const againstPercent = 100 - forPercent;

  return (
    <Link href={`/theory/${slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {realm && <span>{realm}</span>}
            {realm && topic && <span>/</span>}
            {topic && <span>{topic}</span>}
          </div>
          <h3 className="font-semibold leading-tight line-clamp-2">{title}</h3>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{tldr}</p>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-green-500">За {forPercent}%</span>
              <span className="text-red-500">Против {againstPercent}%</span>
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-red-500/20">
              <div
                className="absolute inset-y-0 left-0 bg-green-500 transition-all"
                style={{ width: `${forPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className={`text-xs ${statusColors[status]}`}>
              {status}
            </Badge>
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {cardCount} карточек
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {commentCount}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}