// components/theory/TheoryTLDR.tsx

interface TheoryTLDRProps {
  claim: string;
  tldr: string;
}

export function TheoryTLDR({ claim, tldr }: TheoryTLDRProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <p className="text-lg font-medium break-all overflow-wrap-anywhere">{claim}</p>
      <p className="text-muted-foreground break-all overflow-wrap-anywhere">{tldr}</p>
    </div>
  );
}