// components/theory/TheoryReportButton.tsx
"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReportModal } from "@/components/reports/ReportModal";

interface TheoryReportButtonProps {
  theoryId: string;
  theoryTitle: string;
  className?: string;
}

export function TheoryReportButton({ 
  theoryId, 
  theoryTitle, 
  className 
}: TheoryReportButtonProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 text-muted-foreground hover:text-red-500 ${className}`}
        onClick={() => setIsReportModalOpen(true)}
      >
        <Flag className="h-4 w-4" />
        <span>Пожаловаться</span>
      </Button>

      <ReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        targetId={theoryId}
        targetType="THEORY"
        targetContent={theoryTitle}
        onReportSubmit={() => {
          console.log(`Report submitted for theory ${theoryId}`);
          setIsReportModalOpen(false);
        }}
      />
    </>
  );
}