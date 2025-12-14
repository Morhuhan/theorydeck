// components/theory/ReportButton.tsx
"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ReportButtonProps {
  targetId: string;
  targetType: "THEORY" | "EVIDENCE";
  onReport?: () => void;
  variant?: "ghost" | "outline" | "destructive" | "secondary" | "link";
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
  children?: ReactNode;
}

export function ReportButton({ 
  targetId, 
  targetType, 
  onReport,
  variant = "ghost",
  size = "icon",
  className = "",
  children
}: ReportButtonProps) {
  const handleClick = () => {
    console.log(`Report ${targetType} ${targetId}`);
    onReport?.();
  };

  const buttonVariant = children ? "outline" : variant;

  return (
    <Button
      variant={buttonVariant}
      size={size}
      className={`gap-2 hover:text-red-500 ${className}`}
      onClick={handleClick}
      title="Пожаловаться"
    >
      <Flag className="h-4 w-4" />
      {children && <span>{children}</span>}
    </Button>
  );
}