import { getServerSession } from "next-auth";
import { authConfig } from "./auth.config";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/db/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireModerator() {
  return requireRole([UserRole.MODERATOR, UserRole.ADMIN]);
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}