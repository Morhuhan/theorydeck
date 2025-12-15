// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Layers, Plus, LogOut, User, Shield, Flag } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="px-8 flex items-center gap-2 font-bold">
          <Layers className="h-5 w-5" />
          <span>TheoryDeck</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/theory/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Новая теория
                </Link>
              </Button>

              {(userRole === "MODERATOR" || userRole === "ADMIN") && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/moderation/reports">
                    <Flag className="h-4 w-4 mr-2" />
                    Модерация
                  </Link>
                </Button>
              )}

              {userRole === "ADMIN" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/users">
                    <Shield className="h-4 w-4 mr-2" />
                    Админка
                  </Link>
                </Button>
              )}

              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/50">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Регистрация</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}