// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";
import { Layers, Plus } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="px-8 flex items-center gap-2 font-bold">
          <Layers className="h-5 w-5" />
          <span>TheoryDeck</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {session && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/theory/new">
                <Plus className="h-4 w-4 mr-2" />
                Новая теория
              </Link>
            </Button>
          )}
          <UserMenu user={session?.user} />
        </div>
      </div>
    </header>
  );
}