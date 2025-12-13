// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, Plus, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Layers className="h-5 w-5" />
          <span>TheoryDeck</span>
        </Link>

        <nav className="flex items-center gap-6 ml-6">
          <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Обзор
          </Link>
          <Link href="/trending" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            В тренде
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Новая теория
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}