import { Report, ReportReason, ReportStatus } from '@prisma/client';

export type ReportWithReporter = Report & {
  reporter: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type ReportFormData = {
  reason: ReportReason;
  details?: string;
  theoryId?: string;
  cardId?: string;
};

export type { Report, ReportReason, ReportStatus };