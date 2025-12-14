import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/auth-helpers";

// GET /api/users - получить список пользователей (только для админов)
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const where: any = {};

    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            theories: true,
            evidenceCards: true,
            votes: true,
            reports: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Требуется авторизация" },
          { status: 401 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: "Требуются права администратора" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Ошибка при получении пользователей" },
      { status: 500 }
    );
  }
}
