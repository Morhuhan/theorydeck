import Link from 'next/link';
import { getTheories } from '@/lib/api/theories';
import { TheoryCard } from '@/components/theory/TheoryCard';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default async function HomePage() {
  const session = await getServerSession(authConfig);
  const theories = await getTheories({ status: 'ACTIVE' });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">TheoryDeck</h1>
          <p className="text-gray-600">
            Explore theories, evaluate evidence, and contribute to community knowledge
          </p>
        </div>
        {session && (
          <Link href="/theories/new">
            <Button size="lg">Create Theory</Button>
          </Link>
        )}
      </div>

      {theories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No theories yet</p>
          {session && (
            <Link href="/theories/new">
              <Button>Create the first theory</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theories.map((theory) => (
            <TheoryCard key={theory.id} theory={theory} />
          ))}
        </div>
      )}
    </div>
  );
}