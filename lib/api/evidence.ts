import { EvidenceFormData, EvidenceCardWithVotes } from '@/types';
import prisma from '../db/prisma';

export async function getEvidenceCards(theoryId: string, userId?: string) {
  const cards = await prisma.evidenceCard.findMany({
    where: {
      theoryId,
      status: 'ACTIVE',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      votes: true,
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const cardsWithAverages = cards.map(card => {
    const totalVotes = card.votes.length;
    const averageStrength = totalVotes > 0
      ? card.votes.reduce((sum, vote) => sum + vote.strength, 0) / totalVotes
      : 5;

    const userVote = userId
      ? card.votes.find(vote => vote.userId === userId)
      : undefined;

    return {
      ...card,
      averageStrength,
      userVote,
    };
  });

  return cardsWithAverages;
}

export async function getEvidenceCardById(id: string, userId?: string) {
  const card = await prisma.evidenceCard.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      votes: true,
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!card) return null;

  const totalVotes = card.votes.length;
  const averageStrength = totalVotes > 0
    ? card.votes.reduce((sum, vote) => sum + vote.strength, 0) / totalVotes
    : 5;

  const userVote = userId
    ? card.votes.find(vote => vote.userId === userId)
    : undefined;

  return {
    ...card,
    averageStrength,
    userVote,
  };
}

export async function createEvidenceCard(
  theoryId: string,
  data: EvidenceFormData,
  authorId: string
) {
  const card = await prisma.evidenceCard.create({
    data: {
      content: data.content,
      source: data.source,
      sourceTitle: data.sourceTitle,
      context: data.context,
      stance: data.stance,
      theoryId,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  return card;
}

export async function updateEvidenceCard(
  id: string,
  data: Partial<EvidenceFormData>
) {
  const card = await prisma.evidenceCard.update({
    where: { id },
    data: {
      content: data.content,
      source: data.source,
      sourceTitle: data.sourceTitle,
      context: data.context,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return card;
}

export async function deleteEvidenceCard(id: string) {
  await prisma.evidenceCard.update({
    where: { id },
    data: { status: 'DELETED' },
  });
}