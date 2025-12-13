// app/page.tsx
import { Hero } from "@/components/home/Hero";
import { TheoryList } from "@/components/theory";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="py-8 space-y-8">
      <Hero />
      <Separator />
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Популярные теории</h2>
        </div>
        <TheoryList />
      </section>
    </div>
  );
}