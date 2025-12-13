import { UserRole } from '@prisma/client';

export function canModerate(userRole: UserRole): boolean {
  return userRole === 'MODERATOR' || userRole === 'ADMIN';
}

export function canAdmin(userRole: UserRole): boolean {
  return userRole === 'ADMIN';
}

export function canEditTheory(userId: string, authorId: string, userRole: UserRole): boolean {
  return userId === authorId || canModerate(userRole);
}

export function canDeleteTheory(userId: string, authorId: string, userRole: UserRole): boolean {
  return userId === authorId || canAdmin(userRole);
}

export function canEditEvidence(userId: string, authorId: string, userRole: UserRole): boolean {
  return userId === authorId || canModerate(userRole);
}

export function canDeleteEvidence(userId: string, authorId: string, userRole: UserRole): boolean {
  return userId === authorId || canModerate(userRole);
}

export function canResolveReport(userRole: UserRole): boolean {
  return canModerate(userRole);
}