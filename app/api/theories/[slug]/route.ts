// app/api/theories/[slug]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { CardStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const theory = await prisma.theory.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidenceCards: {
          where: {
            status: CardStatus.ACTIVE,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            votes: true,
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            evidenceCards: true,
            reports: true,
          },
        },
      },
    });

    if (!theory) {
      return NextResponse.json(
        { error: "Теория не найдена" },
        { status: 404 }
      );
    }

    const user = await getCurrentUser();

    const evidenceCardsWithStats = theory.evidenceCards.map((card) => {
      const totalVotes = card.votes.length;
      const averageStrength = totalVotes > 0
        ? card.votes.reduce((sum, vote) => sum + vote.strength, 0) / totalVotes
        : 0;

      const userVote = user
        ? card.votes.find((vote) => vote.userId === user.id)
        : null;

      return {
        ...card,
        votes: undefined,
        voteStats: {
          count: totalVotes,
          averageStrength: Math.round(averageStrength * 10) / 10,
        },
        userVote: userVote ? userVote.strength : null,
      };
    });

    const forCards = evidenceCardsWithStats.filter((c) => c.stance === "FOR");
    const againstCards = evidenceCardsWithStats.filter((c) => c.stance === "AGAINST");

    const forScore = forCards.reduce((sum, card) => {
      if (card.voteStats.count > 0) {
        return sum + (card.voteStats.averageStrength * card.voteStats.count);
      }
      return sum;
    }, 0);

    const againstScore = againstCards.reduce((sum, card) => {
      if (card.voteStats.count > 0) {
        return sum + (card.voteStats.averageStrength * card.voteStats.count);
      }
      return sum;
    }, 0);

    const totalVotes = evidenceCardsWithStats.reduce(
      (sum, card) => sum + card.voteStats.count,
      0
    );

    const total = forScore + againstScore;
    const forPercent = total > 0 ? Math.round((forScore / total) * 100) : 50;
    const againstPercent = total > 0 ? 100 - forPercent : 50;

    return NextResponse.json({
      ...theory,
      evidenceCards: evidenceCardsWithStats,
      voteStats: {
        forScore,
        againstScore,
        totalVotes,
        forPercent,
        againstPercent,
      },
    });
  } catch (error) {
    console.error("Error fetching theory:", error);
    return NextResponse.json(
      { error: "Ошибка при получении теории" },
      { status: 500 }
    );
  }
}