import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getTheoryBySlug } from '@/lib/api/theories';
import { EvidenceForm } from '@/components/evidence/EvidenceForm';

interface NewEvidencePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    stance?: 'FOR' | 'AGAINST';
  };
}

export default async function NewEvidencePage({ params, searchParams }: NewEvidencePageProps) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect('/login');
  }

  const theory = await getTheoryBySlug(params.slug);

  if (!theory) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Evidence</h1>
        <p className="text-gray-600 mb-4">
          Contributing to: <span className="font-semibold">{theory.title}</span>
        </p>
      </div>

      <EvidenceForm 
        theoryId={theory.id} 
        theorySlug={theory.slug}
        defaultStance={searchParams.stance}
      />
    </div>
  );
}