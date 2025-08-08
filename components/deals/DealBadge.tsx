import React from "react";
import { DealType, DEAL_THEMES } from "../../types/deals";

interface DealBadgeProps {
  dealType: DealType;
  className?: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

export default function DealBadge({
  dealType,
  className = "",
  size = "md",
  isActive = true,
}: DealBadgeProps) {
  const theme = DEAL_THEMES[dealType];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const getBadgeText = (type: DealType): string => {
    switch (type) {
      case "voucher":
        return "Voucher";
      case "cold":
        return "Cold";
      case "original":
        return "Original";
      default:
        return "Deal";
    }
  };

  return (
    <div
      className={`
        inline-flex items-center font-medium rounded-full
        ${sizeClasses[size]}
        ${isActive ? "" : "opacity-50"}
        ${className}
      `}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      {getBadgeText(dealType)} Deal
    </div>
  );
}

// Compact version without icon
export function SimpleDealBadge({
  dealType,
  className = "",
  size = "sm",
}: Omit<DealBadgeProps, "isActive">) {
  const theme = DEAL_THEMES[dealType];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const getBadgeText = (type: DealType): string => {
    switch (type) {
      case "voucher":
        return "Voucher";
      case "cold":
        return "Cold";
      case "original":
        return "Original";
      default:
        return "Deal";
    }
  };

  return (
    <span
      className={`
        inline-block font-bold
        ${className}
      `}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      {getBadgeText(dealType)}
    </span>
  );
}
