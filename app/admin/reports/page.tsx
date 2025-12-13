import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export default async function AdminReportsPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      <p className="text-gray-600">Admin reports page - coming soon</p>
    </div>
  );
}