// components/theory/ReportButton.tsx
"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ReportButtonProps {
  targetId: string;
  targetType: "THEORY" | "EVIDENCE";
  onReport?: (e: React.MouseEvent) => void;
  variant?: "ghost" | "outline" | "destructive" | "secondary" | "link";
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
  children?: ReactNode;
  isAuthenticated?: boolean;
}

export function ReportButton({ 
  targetId, 
  targetType, 
  onReport,
  variant = "ghost",
  size = "icon",
  className = "",
  children,
  isAuthenticated = false
}: ReportButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    console.log(`Report ${targetType} ${targetId}`);
    if (onReport) {
      onReport(e);
    }
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