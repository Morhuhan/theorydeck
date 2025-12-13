import { VoteStrength } from '@/types';

export const VOTE_STRENGTH_LABELS: Record<VoteStrength, string> = {
  0: 'No confidence',
  2: 'Weak',
  5: 'Moderate',
  8: 'Strong',
  10: 'Very Strong',
};

export const VOTE_STRENGTH_DESCRIPTIONS: Record<VoteStrength, string> = {
  0: 'This evidence is irrelevant or misleading',
  2: 'This evidence is weak or circumstantial',
  5: 'This evidence is relevant and moderately convincing',
  8: 'This evidence is strong and well-supported',
  10: 'This evidence is definitive and irrefutable',
};