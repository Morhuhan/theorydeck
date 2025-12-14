import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-helpers";

// POST /api/votes - создать или обновить голос
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { cardId, strength } = body;

    if (!cardId || strength === undefined) {
      return NextResponse.json(
        { error: "ID карточки и сила голоса обязательны" },
        { status: 400 }
      );
    }

    // Проверяем, что сила голоса в допустимом диапазоне
    if (strength < 0 || strength > 10) {
      return NextResponse.json(
        { error: "Сила голоса должна быть от 0 до 10" },
        { status: 400 }
      );
    }

    // Проверяем, что карточка существует
    const card = await prisma.evidenceCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Карточка доказательства не найдена" },
        { status: 404 }
      );
    }

    // Используем upsert для создания или обновления голоса
    const vote = await prisma.vote.upsert({
      where: {
        userId_cardId: {
          userId: user.id,
          cardId,
        },
      },
      update: {
        strength,
      },
      create: {
        userId: user.id,
        cardId,
        strength,
      },
      include: {
        card: {
          select: {
            id: true,
            content: true,
            stance: true,
          },
        },
      },
    });

    return NextResponse.json(vote, { status: 200 });
  } catch (error) {
    console.error("Error creating/updating vote:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка при голосовании" },
      { status: 500 }
    );
  }
}
