import { Theory, TheoryStatus } from '@prisma/client';

export type TheoryWithAuthor = Theory & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    evidenceCards: number;
    comments: number;
  };
};

export type TheoryWithDetails = TheoryWithAuthor & {
  evidenceCards: Array<{
    id: string;
    stance: 'FOR' | 'AGAINST';
    status: string;
    _count: {
      votes: number;
    };
  }>;
};

export type TheoryFormData = {
  title: string;
  claim: string;
  tldr: string;
  realm?: string;
  topic?: string;
  tags?: string[];
};

export type TheoryFilters = {
  status?: TheoryStatus;
  realm?: string;
  topic?: string;
  search?: string;
};