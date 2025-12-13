import { Card } from '@/components/ui/card';

interface TheoryTLDRProps {
  text: string;
}

export function TheoryTLDR({ text }: TheoryTLDRProps) {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h2 className="text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
        TL;DR
      </h2>
      <p className="text-gray-800 leading-relaxed">{text}</p>
    </Card>
  );
}