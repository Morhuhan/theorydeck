import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Проверка доступа к админ-панели
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Проверка доступа к модерации
    if (pathname.startsWith("/moderation")) {
      if (token?.role !== "ADMIN" && token?.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Проверка авторизации для создания теорий
    if (pathname.startsWith("/theory/new")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Публичные маршруты
        if (
          pathname === "/" ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          (pathname.startsWith("/theory/") && !pathname.startsWith("/theory/new"))
        ) {
          return true;
        }

        // Для всех остальных защищенных маршрутов требуется авторизация
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/moderation/:path*",
    "/theory/new",
  ],
};
