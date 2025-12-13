import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getTheoryBySlug } from '@/lib/api/theories';
import { canEditTheory } from '@/lib/utils/permissions';
import { TheoryEditForm } from '@/components/theory/TheoryEditForm';

interface EditTheoryPageProps {
  params: {
    slug: string;
  };
}

export default async function EditTheoryPage({ params }: EditTheoryPageProps) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect('/login');
  }

  const theory = await getTheoryBySlug(params.slug);

  if (!theory) {
    notFound();
  }

  if (!canEditTheory(session.user.id, theory.authorId, session.user.role)) {
    redirect(`/theories/${params.slug}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Theory</h1>
        <p className="text-gray-600">Make changes to your theory</p>
      </div>

      <TheoryEditForm theory={theory} />
    </div>
  );
}