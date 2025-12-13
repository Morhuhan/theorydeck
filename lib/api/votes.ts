import { VoteStrength } from '@/types';
import prisma from '../db/prisma';

export async function voteOnCard(
  cardId: string,
  userId: string,
  strength: VoteStrength
) {
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_cardId: {
        userId,
        cardId,
      },
    },
  });

  if (existingVote) {
    const vote = await prisma.vote.update({
      where: {
        userId_cardId: {
          userId,
          cardId,
        },
      },
      data: { strength },
    });
    return vote;
  } else {
    const vote = await prisma.vote.create({
      data: {
        userId,
        cardId,
        strength,
      },
    });
    return vote;
  }
}

export async function removeVote(cardId: string, userId: string) {
  await prisma.vote.delete({
    where: {
      userId_cardId: {
        userId,
        cardId,
      },
    },
  });
}

export async function getUserVote(cardId: string, userId: string) {
  const vote = await prisma.vote.findUnique({
    where: {
      userId_cardId: {
        userId,
        cardId,
      },
    },
  });
  return vote;
}