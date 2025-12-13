import { Badge } from '@/components/ui/badge';
import { THEORY_STATUS_COLORS, THEORY_STATUS_LABELS } from '@/lib/constants/report-reasons';
import { TheoryStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: TheoryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = THEORY_STATUS_LABELS[status];
  const colorClass = THEORY_STATUS_COLORS[status];

  return (
    <Badge className={`${colorClass} text-white`}>
      {label}
    </Badge>
  );
}