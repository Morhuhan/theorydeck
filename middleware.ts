import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/moderation")) {
      if (token?.role !== "ADMIN" && token?.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        const publicPaths = ["/login", "/register", "/forgot-password"];
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/moderation/:path*", "/theory/new", "/profile/:path*"],
};