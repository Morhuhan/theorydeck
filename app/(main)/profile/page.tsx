import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { Card } from '@/components/ui/card';
import prisma from '@/lib/db/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      theories: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      evidenceCards: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          theories: true,
          evidenceCards: true,
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {user._count.theories}
            </div>
            <div className="text-sm text-gray-600">Theories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {user._count.evidenceCards}
            </div>
            <div className="text-sm text-gray-600">Evidence Cards</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {user._count.votes}
            </div>
            <div className="text-sm text-gray-600">Votes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {user._count.comments}
            </div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Theories</h3>
          {user.theories.length === 0 ? (
            <p className="text-gray-500">No theories yet</p>
          ) : (
            <ul className="space-y-3">
              {user.theories.map((theory) => (
                <li key={theory.id}>
                  <a
                    href={`/theories/${theory.slug}`}
                    className="text-blue-600 hover:underline block"
                  >
                    {theory.title}
                  </a>
                  <p className="text-sm text-gray-500">
                    {new Date(theory.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Evidence</h3>
          {user.evidenceCards.length === 0 ? (
            <p className="text-gray-500">No evidence cards yet</p>
          ) : (
            <ul className="space-y-3">
              {user.evidenceCards.map((card) => (
                <li key={card.id} className="border-b pb-2 last:border-0">
                  <p className="text-sm line-clamp-2">{card.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}