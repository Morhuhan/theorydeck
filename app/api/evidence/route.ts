import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-helpers";
import { Stance, CardStatus } from "@prisma/client";

// POST /api/evidence - создать карточку доказательства
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const {
      theoryId,
      content,
      stance,
      source,
      sourceTitle,
      context,
    } = body;

    if (!theoryId || !content || !stance) {
      return NextResponse.json(
        { error: "Теория, содержание и позиция обязательны" },
        { status: 400 }
      );
    }

    // Проверяем, что stance корректный
    if (!Object.values(Stance).includes(stance)) {
      return NextResponse.json(
        { error: "Некорректная позиция" },
        { status: 400 }
      );
    }

    // Проверяем, что теория существует
    const theory = await prisma.theory.findUnique({
      where: { id: theoryId },
    });

    if (!theory) {
      return NextResponse.json(
        { error: "Теория не найдена" },
        { status: 404 }
      );
    }

    const evidenceCard = await prisma.evidenceCard.create({
      data: {
        content,
        stance,
        source: source || null,
        sourceTitle: sourceTitle || null,
        context: context || null,
        theoryId,
        authorId: user.id,
        status: CardStatus.ACTIVE,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        theory: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(evidenceCard, { status: 201 });
  } catch (error) {
    console.error("Error creating evidence card:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка при создании карточки" },
      { status: 500 }
    );
  }
}
