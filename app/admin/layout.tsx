import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <Link href="/" className="text-sm hover:underline">
              Back to site
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6 flex gap-4 border-b pb-4">
          <Link
            href="/admin/theories"
            className="text-gray-600 hover:text-gray-900"
          >
            Theories
          </Link>
          <Link
            href="/admin/reports"
            className="text-gray-600 hover:text-gray-900"
          >
            Reports
          </Link>
        </nav>
        
        {children}
      </div>
    </div>
  );
}