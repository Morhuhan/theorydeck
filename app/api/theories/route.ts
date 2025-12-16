// app/api/theories/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-helpers";
import { TheoryStatus, CardStatus } from "@prisma/client";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const realm = searchParams.get("realm");
    const topic = searchParams.get("topic");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = {};

    if (status) {
      where.status = status as TheoryStatus;
    } else {
      where.status = TheoryStatus.ACTIVE;
    }

    if (realm) {
      where.realm = realm;
    }

    if (topic) {
      where.topic = topic;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          claim: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            hasSome: [search],
          },
        },
      ];
    }

    const [theories, totalCount] = await Promise.all([
      prisma.theory.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              evidenceCards: true,
            },
          },
          evidenceCards: {
            where: {
              status: CardStatus.ACTIVE,
            },
            include: {
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: page * limit,
        take: limit + 1,
      }),
      prisma.theory.count({ where }),
    ]);

    const hasMore = theories.length > limit;
    const theoriesToReturn = hasMore ? theories.slice(0, limit) : theories;

    // Подсчитываем статистику голосов для каждой теории
    const theoriesWithStats = theoriesToReturn.map((theory) => {
      // Разделяем карточки по stance
      const forCards = theory.evidenceCards.filter((c) => c.stance === "FOR");
      const againstCards = theory.evidenceCards.filter((c) => c.stance === "AGAINST");

      // Считаем score для карточек "ЗА"
      let forScore = 0;
      let forVoteCount = 0;
      forCards.forEach((card) => {
        if (card.votes.length > 0) {
          const cardAverage = card.votes.reduce((sum, vote) => sum + vote.strength, 0) / card.votes.length;
          forScore += cardAverage * card.votes.length;
          forVoteCount += card.votes.length;
        }
      });

      // Считаем score для карточек "ПРОТИВ"
      let againstScore = 0;
      let againstVoteCount = 0;
      againstCards.forEach((card) => {
        if (card.votes.length > 0) {
          const cardAverage = card.votes.reduce((sum, vote) => sum + vote.strength, 0) / card.votes.length;
          againstScore += cardAverage * card.votes.length;
          againstVoteCount += card.votes.length;
        }
      });

      const totalVotes = forVoteCount + againstVoteCount;
      const totalScore = forScore + againstScore;

      // Рассчитываем процент "ЗА"
      const forPercent = totalScore > 0 ? Math.round((forScore / totalScore) * 100) : 50;

      return {
        id: theory.id,
        slug: theory.slug,
        title: theory.title,
        claim: theory.claim,
        tldr: theory.tldr,
        realm: theory.realm,
        topic: theory.topic,
        tags: theory.tags,
        status: theory.status,
        createdAt: theory.createdAt,
        author: theory.author,
        _count: {
          evidenceCards: theory._count.evidenceCards,
        },
        voteStats: {
          forPercent: totalVotes > 0 ? forPercent : null,
        },
      };
    });

    return NextResponse.json({
      theories: theoriesWithStats,
      hasMore,
      totalCount,
      page,
    });
  } catch (error) {
    console.error("Error fetching theories:", error);
    return NextResponse.json(
      { error: "Ошибка при получении теорий" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { title, claim, tldr, realm, topic, tags, status } = body;

    if (!title || !claim || !tldr) {
      return NextResponse.json(
        { error: "Заголовок, формулировка и TL;DR обязательны" },
        { status: 400 }
      );
    }

    let slug = generateSlug(title);

    const existingTheory = await prisma.theory.findUnique({
      where: { slug },
    });

    if (existingTheory) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const theory = await prisma.theory.create({
      data: {
        slug,
        title,
        claim,
        tldr,
        realm: realm || null,
        topic: topic || null,
        tags: tags || [],
        status: status || TheoryStatus.ACTIVE,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(theory, { status: 201 });
  } catch (error) {
    console.error("Error creating theory:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка при создании теории" },
      { status: 500 }
    );
  }
}