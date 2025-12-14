import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-helpers";
import { TheoryStatus } from "@prisma/client";

// Функция для создания slug из заголовка
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET /api/theories - получить список теорий
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const realm = searchParams.get("realm");
    const topic = searchParams.get("topic");

    const where: any = {};

    if (status) {
      where.status = status as TheoryStatus;
    } else {
      // По умолчанию показываем только активные теории
      where.status = TheoryStatus.ACTIVE;
    }

    if (realm) {
      where.realm = realm;
    }

    if (topic) {
      where.topic = topic;
    }

    const theories = await prisma.theory.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(theories);
  } catch (error) {
    console.error("Error fetching theories:", error);
    return NextResponse.json(
      { error: "Ошибка при получении теорий" },
      { status: 500 }
    );
  }
}

// POST /api/theories - создать новую теорию
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

    // Генерируем slug из заголовка
    let slug = generateSlug(title);

    // Проверяем уникальность slug
    const existingTheory = await prisma.theory.findUnique({
      where: { slug },
    });

    // Если slug уже существует, добавляем случайный суффикс
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
