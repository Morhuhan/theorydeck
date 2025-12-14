import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireModerator } from "@/lib/auth/auth-helpers";
import { ReportStatus, CardStatus, TheoryStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/reports/[id] - обновить статус жалобы (только для модераторов)
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await requireModerator();
    const { id } = await context.params;
    const body = await request.json();
    const { status, action } = body;

    // Проверяем, что жалоба существует
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        theory: true,
        card: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Жалоба не найдена" },
        { status: 404 }
      );
    }

    // Обрабатываем различные действия
    let updateData: any = {};

    if (status && Object.values(ReportStatus).includes(status)) {
      updateData.status = status;

      if (status === ReportStatus.RESOLVED || status === ReportStatus.DISMISSED) {
        updateData.resolvedAt = new Date();
      }
    }

    // Если указано действие по контенту
    if (action === "DELETE" && report.cardId) {
      // Удаляем карточку (помечаем как DELETED)
      await prisma.evidenceCard.update({
        where: { id: report.cardId },
        data: { status: CardStatus.DELETED },
      });
      updateData.status = ReportStatus.RESOLVED;
      updateData.resolvedAt = new Date();
    } else if (action === "DELETE" && report.theoryId) {
      // Архивируем или помечаем теорию как модерированную
      await prisma.theory.update({
        where: { id: report.theoryId },
        data: { status: TheoryStatus.MODERATED },
      });
      updateData.status = ReportStatus.RESOLVED;
      updateData.resolvedAt = new Date();
    } else if (action === "HIDE" && report.cardId) {
      // Скрываем карточку
      await prisma.evidenceCard.update({
        where: { id: report.cardId },
        data: { status: CardStatus.HIDDEN },
      });
      updateData.status = ReportStatus.RESOLVED;
      updateData.resolvedAt = new Date();
    } else if (action === "FLAG" && report.cardId) {
      // Помечаем карточку как требующую внимания
      await prisma.evidenceCard.update({
        where: { id: report.cardId },
        data: { status: CardStatus.FLAGGED },
      });
      updateData.status = ReportStatus.REVIEWED;
    }

    // Обновляем жалобу
    const updatedReport = await prisma.report.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);

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
      { error: "Ошибка при обновлении жалобы" },
      { status: 500 }
    );
  }
}
