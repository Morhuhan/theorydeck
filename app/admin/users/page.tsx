import { UsersManagement } from "@/components/admin/UsersManagement";

export default function AdminUsersPage() {
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
