"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Моковые данные для примера
const mockUsers = [
  {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    role: "USER",
    createdAt: new Date("2024-01-15"),
    theoriesCount: 12,
    evidenceCount: 45,
  },
  {
    id: "2",
    name: "Мария Сидорова",
    email: "maria@example.com",
    role: "MODERATOR",
    createdAt: new Date("2024-02-20"),
    theoriesCount: 8,
    evidenceCount: 32,
  },
  {
    id: "3",
    name: "Петр Иванов",
    email: "petr@example.com",
    role: "ADMIN",
    createdAt: new Date("2024-01-01"),
    theoriesCount: 5,
    evidenceCount: 15,
  },
  {
    id: "4",
    name: "Анна Смирнова",
    email: "anna@example.com",
    role: "USER",
    createdAt: new Date("2024-03-10"),
    theoriesCount: 3,
    evidenceCount: 18,
  },
  {
    id: "5",
    name: "Дмитрий Козлов",
    email: "dmitry@example.com",
    role: "USER",
    createdAt: new Date("2024-04-05"),
    theoriesCount: 15,
    evidenceCount: 67,
  },
  {
    id: "6",
    name: "Елена Волкова",
    email: "elena@example.com",
    role: "MODERATOR",
    createdAt: new Date("2024-02-15"),
    theoriesCount: 6,
    evidenceCount: 24,
  },
];

const roleLabels: Record<string, string> = {
  USER: "Пользователь",
  MODERATOR: "Модератор",
  ADMIN: "Администратор",
};

const roleColors: Record<string, "default" | "secondary" | "destructive"> = {
  USER: "default",
  MODERATOR: "secondary",
  ADMIN: "destructive",
};

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangeRole = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser && newRole) {
      console.log(`Changing role for user ${selectedUser.id} to ${newRole}`);
      // Здесь будет вызов API для изменения роли
      setIsDialogOpen(false);
      setSelectedUser(null);
      setNewRole("");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Поиск</Label>
              <Input
                id="search"
                placeholder="Имя или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">Роль</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="USER">Пользователи</SelectItem>
                  <SelectItem value="MODERATOR">Модераторы</SelectItem>
                  <SelectItem value="ADMIN">Администраторы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего пользователей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Модераторов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter((u) => u.role === "MODERATOR").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Администраторов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter((u) => u.role === "ADMIN").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список пользователей */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Alert>
            <AlertDescription>Пользователи не найдены</AlertDescription>
          </Alert>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 items-start flex-1">
                    <Avatar className="h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground">
                      <span className="text-lg font-semibold">
                        {getUserInitials(user.name)}
                      </span>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Теорий: {user.theoriesCount}</span>
                        <span>•</span>
                        <span>Доказательств: {user.evidenceCount}</span>
                        <span>•</span>
                        <span>
                          Зарегистрирован: {user.createdAt.toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <div>
                        <Badge variant={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleChangeRole(user)}
                  >
                    Изменить роль
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Диалог изменения роли */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменение роли пользователя</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  Изменить роль для пользователя <strong>{selectedUser.name}</strong> (
                  {selectedUser.email})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role">Новая роль</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="new-role">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Пользователь</SelectItem>
                  <SelectItem value="MODERATOR">Модератор</SelectItem>
                  <SelectItem value="ADMIN">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedUser && newRole === selectedUser.role && (
              <Alert>
                <AlertDescription>
                  Это текущая роль пользователя
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedUser(null);
                setNewRole("");
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={!newRole || (selectedUser && newRole === selectedUser.role)}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
