import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 px-4">
        <Link href="/" className="text-2xl font-bold">
          TheoryDeck
        </Link>
      </div>
      {children}
    </div>
  );
}