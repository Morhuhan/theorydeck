import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/auth-helpers";
import { UserRole } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/users/[id] - обновить пользователя (только для админов)
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const { role, name } = body;

    // Проверяем, что пользователь существует
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (role && Object.values(UserRole).includes(role)) {
      updateData.role = role;
    }

    if (name !== undefined) {
      updateData.name = name;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

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
      { error: "Ошибка при обновлении пользователя" },
      { status: 500 }
    );
  }
}
