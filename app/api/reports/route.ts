import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth, requireModerator } from "@/lib/auth/auth-helpers";
import { ReportReason, ReportStatus } from "@prisma/client";

// GET /api/reports - получить список жалоб (только для модераторов)
export async function GET(request: Request) {
  try {
    await requireModerator();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};

    if (status && Object.values(ReportStatus).includes(status as ReportStatus)) {
      where.status = status as ReportStatus;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
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
        card: {
          select: {
            id: true,
            content: true,
            theory: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Требуется авторизация" },
          { status: 401 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: "Требуются права модератора" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Ошибка при получении жалоб" },
      { status: 500 }
    );
  }
}

// POST /api/reports - создать жалобу
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { reason, details, theoryId, cardId } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Причина жалобы обязательна" },
        { status: 400 }
      );
    }

    // Проверяем, что reason корректный
    if (!Object.values(ReportReason).includes(reason)) {
      return NextResponse.json(
        { error: "Некорректная причина жалобы" },
        { status: 400 }
      );
    }

    // Проверяем, что указан либо theoryId, либо cardId
    if (!theoryId && !cardId) {
      return NextResponse.json(
        { error: "Необходимо указать теорию или карточку для жалобы" },
        { status: 400 }
      );
    }

    // Проверяем существование теории или карточки
    if (theoryId) {
      const theory = await prisma.theory.findUnique({
        where: { id: theoryId },
      });
      if (!theory) {
        return NextResponse.json(
          { error: "Теория не найдена" },
          { status: 404 }
        );
      }
    }

    if (cardId) {
      const card = await prisma.evidenceCard.findUnique({
        where: { id: cardId },
      });
      if (!card) {
        return NextResponse.json(
          { error: "Карточка доказательства не найдена" },
          { status: 404 }
        );
      }
    }

    const report = await prisma.report.create({
      data: {
        reason,
        details: details || null,
        reporterId: user.id,
        theoryId: theoryId || null,
        cardId: cardId || null,
        status: ReportStatus.PENDING,
      },
      include: {
        reporter: {
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
        card: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Ошибка при создании жалобы" },
      { status: 500 }
    );
  }
}
