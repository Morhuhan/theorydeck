// app/page.tsx
import { Hero } from "@/components/home/Hero";
import { TheoryList } from "@/components/theory";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="px-4 space-y-8">
      <Hero />
      <Separator />
      <section className="space-y-6">
        <TheoryList />
      </section>
    </div>
  );
}