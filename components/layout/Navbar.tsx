// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Plus,
  LogOut,
  User,
  Shield,
  Flag,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Layers className="h-5 w-5" />
          <span className="text-base sm:text-lg">TheoryDeck</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  TheoryDeck
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 mb-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">
                        {session.user?.name || session.user?.email}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                      onClick={closeSheet}
                    >
                      <Link href="/theory/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Новая теория
                      </Link>
                    </Button>

                    {(userRole === "MODERATOR" || userRole === "ADMIN") && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                        onClick={closeSheet}
                      >
                        <Link href="/moderation/reports">
                          <Flag className="h-4 w-4 mr-2" />
                          Модерация
                        </Link>
                      </Button>
                    )}

                    {userRole === "ADMIN" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                        onClick={closeSheet}
                      >
                        <Link href="/admin/users">
                          <Shield className="h-4 w-4 mr-2" />
                          Админка
                        </Link>
                      </Button>
                    )}

                    <div className="h-px bg-border my-2" />

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      onClick={closeSheet}
                    >
                      <Link href="/login">Войти</Link>
                    </Button>
                    <Button
                      variant="default"
                      className="w-full"
                      asChild
                      onClick={closeSheet}
                    >
                      <Link href="/register">Регистрация</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}