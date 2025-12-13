// app/theory/[slug]/page.tsx
import { TheoryPage } from "@/components/theory/TheoryPage";

interface TheoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Theory({ params }: TheoryPageProps) {
  const { slug } = await params;
  
  return <TheoryPage slug={slug} />;
}