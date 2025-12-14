// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "TheoryDeck - Доказательные дискуссии",
  description: "Платформа для структурированного обсуждения теорий с доказательствами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background antialiased`}>
        <Navbar />
        <main className="flex-1 container px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}