import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default async function AdminTheoriesPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Theories</h1>
      <p className="text-gray-600">Admin theories page - coming soon</p>
    </div>
  );
}