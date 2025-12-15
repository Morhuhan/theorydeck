// app/page.tsx
import { Hero } from "@/components/home/Hero";
import { TheoryList } from "@/components/theory";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="space-y-8">
      <Hero />
      <Separator className="my-8" />
      <section className="space-y-6">
        <TheoryList />
      </section>
    </div>
  );
}