import { redirect } from "next/navigation";
import { ReportsModeration } from "@/components/moderation/ReportsModeration";
import { requireModerator } from "@/lib/auth/auth-helpers";

export default async function ModerationReportsPage() {
  try {
    await requireModerator();
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Модерация жалоб</h1>
        <p className="text-muted-foreground mt-2">
          Рассмотрение жалоб на теории и доказательства
        </p>
      </div>
      <ReportsModeration />
    </div>
  );
}
