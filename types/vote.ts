import { Vote } from '@prisma/client';

export type VoteStrength = 0 | 2 | 5 | 8 | 10;

export const VOTE_STRENGTHS: VoteStrength[] = [0, 2, 5, 8, 10];

export type VoteData = {
  cardId: string;
  strength: VoteStrength;
};

export type { Vote };