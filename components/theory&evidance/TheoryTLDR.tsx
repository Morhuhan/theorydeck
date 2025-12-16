// components/theory/TheoryTLDR.tsx

interface TheoryTLDRProps {
  claim: string;
  tldr: string;
}

export function TheoryTLDR({ claim, tldr }: TheoryTLDRProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <p className="text-lg font-medium ">{claim}</p>
      <p className="text-muted-foreground ">{tldr}</p>
    </div>
  );
}