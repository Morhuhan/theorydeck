import { TheoryFormData, EvidenceFormData, CommentFormData, VoteStrength, VOTE_STRENGTHS } from '@/types';

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateTheoryForm(data: Partial<TheoryFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }
  if (data.title && data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.claim || data.claim.trim().length < 10) {
    errors.claim = 'Claim must be at least 10 characters';
  }
  if (data.claim && data.claim.length > 2000) {
    errors.claim = 'Claim must be less than 2000 characters';
  }

  if (!data.tldr || data.tldr.trim().length < 10) {
    errors.tldr = 'TL;DR must be at least 10 characters';
  }
  if (data.tldr && data.tldr.length > 500) {
    errors.tldr = 'TL;DR must be less than 500 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEvidenceForm(data: Partial<EvidenceFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.content || data.content.trim().length < 10) {
    errors.content = 'Evidence must be at least 10 characters';
  }
  if (data.content && data.content.length > 2000) {
    errors.content = 'Evidence must be less than 2000 characters';
  }

  if (!data.stance || !['FOR', 'AGAINST'].includes(data.stance)) {
    errors.stance = 'Invalid stance';
  }

  if (data.source && data.source.length > 500) {
    errors.source = 'Source URL must be less than 500 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCommentForm(data: Partial<CommentFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.content || data.content.trim().length < 1) {
    errors.content = 'Comment cannot be empty';
  }
  if (data.content && data.content.length > 1000) {
    errors.content = 'Comment must be less than 1000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVoteStrength(strength: number): strength is VoteStrength {
  return VOTE_STRENGTHS.includes(strength as VoteStrength);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}