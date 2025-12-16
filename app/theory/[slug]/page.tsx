import { TheoryPage } from "@/components/theory&evidance/TheoryPage";

interface TheoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Theory({ params }: TheoryPageProps) {
  const { slug } = await params;
  
  return <TheoryPage slug={slug} />;
}