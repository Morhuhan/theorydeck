import { redirect } from "next/navigation";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { requireAdmin } from "@/lib/auth/auth-helpers";

export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>
        <p className="text-muted-foreground mt-2">
          Просмотр и управление ролями пользователей
        </p>
      </div>
      <UsersManagement />
    </div>
  );
}
