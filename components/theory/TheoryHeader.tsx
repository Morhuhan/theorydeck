import { TheoryWithDetails } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils/formatting';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TagBadge } from '@/components/shared/TagBadge';

interface TheoryHeaderProps {
  theory: TheoryWithDetails;
}

export function TheoryHeader({ theory }: TheoryHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={theory.status} />
        {theory.realm && <TagBadge text={theory.realm} variant="realm" />}
        {theory.topic && <TagBadge text={theory.topic} variant="topic" />}
      </div>

      <h1 className="text-4xl font-bold mb-4">{theory.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          By <span className="font-medium">{theory.author.name || 'Anonymous'}</span>
        </span>
        <span>•</span>
        <span>{formatRelativeTime(theory.createdAt)}</span>
      </div>

      {theory.tags && theory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {theory.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}