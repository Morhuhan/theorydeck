import { notFound } from 'next/navigation';
import { getTheoryBySlug } from '@/lib/api/theories';
import { TheoryHeader } from '@/components/theory/TheoryHeader';
import { TheoryTLDR } from '@/components/theory/TheoryTLDR';
import { ConfidenceBar } from '@/components/theory/ConfidenceBar';
import { EvidenceList } from '@/components/evidence/EvidenceList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { calculateConfidence } from '@/lib/utils/confidence';

interface TheoryPageProps {
  params: {
    slug: string;
  };
}

export default async function TheoryPage({ params }: TheoryPageProps) {
  const session = await getServerSession(authConfig);
  const theory = await getTheoryBySlug(params.slug);

  if (!theory) {
    notFound();
  }

  const cardsWithAverages = theory.evidenceCards.map(card => ({
    ...card,
    averageStrength: 5,
  }));

  const confidence = calculateConfidence(cardsWithAverages);
  const forCards = cardsWithAverages.filter(c => c.stance === 'FOR');
  const againstCards = cardsWithAverages.filter(c => c.stance === 'AGAINST');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <TheoryHeader theory={theory} />
      
      <div className="mt-6">
        <TheoryTLDR text={theory.tldr} />
      </div>

      <div className="mt-8">
        <ConfidenceBar confidence={confidence} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Evidence</h2>
        
        <Tabs defaultValue="for" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="for">
                For ({forCards.length})
              </TabsTrigger>
              <TabsTrigger value="against">
                Against ({againstCards.length})
              </TabsTrigger>
            </TabsList>
            
            {session && (
              <Link href={`/theories/${theory.slug}/evidence/new`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Evidence
                </Button>
              </Link>
            )}
          </div>

          <TabsContent value="for">
            {forCards.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No evidence for this theory yet</p>
                {session && (
                  <Link href={`/theories/${theory.slug}/evidence/new?stance=FOR`}>
                    <Button className="mt-4" variant="outline">
                      Add the first evidence
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <EvidenceList cards={forCards} theorySlug={theory.slug} />
            )}
          </TabsContent>

          <TabsContent value="against">
            {againstCards.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No evidence against this theory yet</p>
                {session && (
                  <Link href={`/theories/${theory.slug}/evidence/new?stance=AGAINST`}>
                    <Button className="mt-4" variant="outline">
                      Add the first evidence
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <EvidenceList cards={againstCards} theorySlug={theory.slug} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}