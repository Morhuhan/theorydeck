"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Моковые данные для примера
const mockReports = [
  {
    id: "1",
    type: "theory",
    targetTitle: "Теория о пришельцах на Земле",
    targetId: "theory-1",
    reason: "MISINFORMATION",
    details: "Содержит непроверенные факты и дезинформацию",
    status: "PENDING",
    reporterName: "Иван Петров",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    type: "evidence",
    targetTitle: "Доказательство против теории плоской Земли",
    targetId: "evidence-1",
    reason: "SPAM",
    details: "Многократное повторение одного и того же контента",
    status: "PENDING",
    reporterName: "Мария Сидорова",
    createdAt: new Date("2025-01-11"),
  },
  {
    id: "3",
    type: "theory",
    targetTitle: "Эволюция человека",
    targetId: "theory-2",
    reason: "INAPPROPRIATE",
    details: "Содержит оскорбительные высказывания",
    status: "REVIEWED",
    reporterName: "Петр Иванов",
    createdAt: new Date("2025-01-09"),
  },
  {
    id: "4",
    type: "evidence",
    targetTitle: "Источник о климатических изменениях",
    targetId: "evidence-2",
    reason: "SPOILER",
    details: "Раскрывает важную информацию",
    status: "RESOLVED",
    reporterName: "Анна Смирнова",
    createdAt: new Date("2025-01-08"),
  },
];

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
  const [resolutionNote, setResolutionNote] = useState("");

  const filteredReports = mockReports.filter((report) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return report.status === "PENDING";
    if (activeTab === "reviewed") return report.status === "REVIEWED";
    if (activeTab === "resolved") return report.status === "RESOLVED" || report.status === "DISMISSED";
    return true;
  });

  const handleAction = (reportId: string, action: string) => {
    console.log(`Action ${action} for report ${reportId}`);
    // Здесь будет вызов API для изменения статуса жалобы
    setSelectedReport(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="pending">
            Ожидают <Badge variant="destructive" className="ml-2">{mockReports.filter(r => r.status === "PENDING").length}</Badge>
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
                        {report.targetTitle}
                      </CardTitle>
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {report.type === "theory" ? "Теория" : "Доказательство"}
                        </Badge>
                        <span>•</span>
                        <span>От: {report.reporterName}</span>
                        <span>•</span>
                        <span>{report.createdAt.toLocaleDateString("ru-RU")}</span>
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
                      <div className="space-y-2">
                        <Label htmlFor={`note-${report.id}`}>Примечание к решению</Label>
                        <Textarea
                          id={`note-${report.id}`}
                          placeholder="Опишите принятое решение..."
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          rows={3}
                        />
                      </div>
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
                          onClick={() => {
                            setSelectedReport(null);
                            setResolutionNote("");
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => window.open(`/theory/${report.targetId}`, "_blank")}
                      >
                        Просмотреть
                      </Button>
                      {report.status === "PENDING" && (
                        <Button
                          onClick={() => setSelectedReport(report.id)}
                        >
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
