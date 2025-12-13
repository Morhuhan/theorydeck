import { TheoryStatus } from '@prisma/client';

export const THEORY_STATUS_LABELS: Record<TheoryStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  RESOLVED: 'Resolved',
  MODERATED: 'Moderated',
};

export const THEORY_STATUS_COLORS: Record<TheoryStatus, string> = {
  DRAFT: 'bg-gray-500',
  ACTIVE: 'bg-green-500',
  ARCHIVED: 'bg-blue-500',
  RESOLVED: 'bg-purple-500',
  MODERATED: 'bg-red-500',
};