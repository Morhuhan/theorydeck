// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © 2024 TheoryDeck. Все права защищены.
        </p>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            О проекте
          </Link>
          <Link href="/rules" className="hover:text-foreground transition-colors">
            Правила
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Конфиденциальность
          </Link>
        </nav>
      </div>
    </footer>
  );
}