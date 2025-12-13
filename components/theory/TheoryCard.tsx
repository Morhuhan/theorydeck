import Link from 'next/link';
import { TheoryWithAuthor } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, truncateText, pluralize } from '@/lib/utils/formatting';
import { MessageSquare, FileText } from 'lucide-react';

interface TheoryCardProps {
  theory: TheoryWithAuthor;
}

export function TheoryCard({ theory }: TheoryCardProps) {
  return (
    <Link href={`/theories/${theory.slug}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold line-clamp-2 flex-1">
            {theory.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {theory.tldr}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {theory.realm && (
            <Badge variant="secondary" className="text-xs">
              {theory.realm}
            </Badge>
          )}
          {theory.topic && (
            <Badge variant="outline" className="text-xs">
              {theory.topic}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {pluralize(theory._count?.evidenceCards || 0, 'card')}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {theory._count?.comments || 0}
            </span>
          </div>
          <span className="text-xs">
            {formatRelativeTime(theory.createdAt)}
          </span>
        </div>
      </Card>
    </Link>
  );
}