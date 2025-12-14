"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const reasonLabels: Record<string, string> = {
  SPAM: "Спам",
  MISINFORMATION: "Дезинформация",
  INAPPROPRIATE: "Неуместный контент",
  SPOILER: "Спойлер",
  LEAK: "Утечка данных",
  DUPLICATE: "Дубликат",
  OTHER: "Другое",
};

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает рассмотрения",
  REVIEWED: "Рассмотрено",
  RESOLVED: "Решено",
  DISMISSED: "Отклонено",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "destructive",
  REVIEWED: "secondary",
  RESOLVED: "default",
  DISMISSED: "outline",
};

export function ReportsModeration() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reports");

      if (!response.ok) {
        throw new Error("Ошибка при загрузке жалоб");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return report.status === "PENDING";
    if (activeTab === "reviewed") return report.status === "REVIEWED";
    if (activeTab === "resolved") return report.status === "RESOLVED" || report.status === "DISMISSED";
    return true;
  });

  const handleAction = async (reportId: string, action: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, status: action === "DELETE" ? "RESOLVED" : action }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обработке жалобы");
      }

      setSelectedReport(null);
      await loadReports();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка жалоб...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const pendingCount = reports.filter(r => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="pending">
            Ожидают {pendingCount > 0 && <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="reviewed">Рассмотренные</TabsTrigger>
          <TabsTrigger value="resolved">Завершённые</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredReports.length === 0 ? (
            <Alert>
              <AlertDescription>Жалоб не найдено</AlertDescription>
            </Alert>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {report.theory?.title || report.card?.content?.substring(0, 100) || "Удалено"}
                      </CardTitle>
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {report.theory ? "Теория" : "Доказательство"}
                        </Badge>
                        <span>•</span>
                        <span>От: {report.reporter.name || report.reporter.email}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                    <Badge variant={statusColors[report.status]}>
                      {statusLabels[report.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Причина жалобы:</Label>
                    <div className="mt-1">
                      <Badge variant="secondary">{reasonLabels[report.reason]}</Badge>
                    </div>
                  </div>

                  {report.details && (
                    <div>
                      <Label className="text-sm font-semibold">Детали:</Label>
                      <p className="text-sm mt-1 text-muted-foreground">{report.details}</p>
                    </div>
                  )}

                  <Separator />

                  {selectedReport === report.id ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() => handleAction(report.id, "RESOLVED")}
                        >
                          Решено
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleAction(report.id, "DELETE")}
                        >
                          Удалить контент
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAction(report.id, "DISMISSED")}
                        >
                          Отклонить
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedReport(null)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {report.theory && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(`/theory/${report.theory.slug}`, "_blank")}
                        >
                          Просмотреть
                        </Button>
                      )}
                      {report.status === "PENDING" && (
                        <Button onClick={() => setSelectedReport(report.id)}>
                          Рассмотреть
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
