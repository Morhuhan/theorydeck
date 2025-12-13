import { EvidenceCard, Stance, CardStatus } from '@prisma/client';

export type EvidenceCardWithAuthor = EvidenceCard & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    votes: number;
    comments: number;
  };
};

export type EvidenceCardWithVotes = EvidenceCardWithAuthor & {
  votes: Array<{
    id: string;
    strength: number;
    userId: string;
  }>;
  averageStrength: number;
  userVote?: {
    id: string;
    strength: number;
  };
};

export type EvidenceFormData = {
  content: string;
  source?: string;
  sourceTitle?: string;
  context?: string;
  stance: Stance;
};

export type EvidenceSortOption = 
  | 'strength-desc'
  | 'strength-asc'
  | 'recent'
  | 'oldest';

export { Stance, CardStatus };