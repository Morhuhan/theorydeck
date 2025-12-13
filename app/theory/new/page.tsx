// app/theory/new/page.tsx
import { TheoryForm } from "@/components/forms/TheoryForm";

export default function NewTheoryPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создать новую теорию</h1>
      <TheoryForm />
    </div>
  );
}