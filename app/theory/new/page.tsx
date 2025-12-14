// app/theory/new/page.tsx
import { redirect } from "next/navigation";
import { TheoryForm } from "@/components/forms/TheoryForm";
import { getCurrentUser } from "@/lib/auth/auth-helpers";

export default async function NewTheoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создать новую теорию</h1>
      <TheoryForm />
    </div>
  );
}