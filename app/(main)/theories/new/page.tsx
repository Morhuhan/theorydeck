import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { TheoryForm } from '@/components/theory/TheoryForm';

export default async function NewTheoryPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Theory</h1>
        <p className="text-gray-600">
          Share a theory and let the community evaluate the evidence
        </p>
      </div>

      <TheoryForm />
    </div>
  );
}