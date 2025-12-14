import { ReportsModeration } from "@/components/moderation/ReportsModeration";

export default function ModerationReportsPage() {
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
