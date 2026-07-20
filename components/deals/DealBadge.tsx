import React from "react";
import { DealType, DEAL_THEMES } from "../../types/deals";

interface DealBadgeProps {
  dealType: DealType;
  className?: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

function VoucherIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 10v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h16a2 2 0 012 2zm-2-6H4a2 2 0 00-2 2v2h20V6a2 2 0 00-2-2zM7 15a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h4c.55 0 1 .45 1 1s-.45 1-1 1h-1v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H3c-.55 0-1-.45-1-1s.45-1 1-1h4zm2 0h6V2.5H9V4zM6 6v13h12V6H6z" />
    </svg>
  );
}

function ColdIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.09 3.26L16 4l-1.09 3.26L18 8.5l-3.26 1.09L16 13l-3.26-1.09L12 15l-1.09-3.26L8 13l1.09-3.26L6 8.5l3.26-1.09L8 4l2.91 1.26L12 2zm0 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
    </svg>
  );
}

export default function DealBadge({
  dealType,
  className = "",
  size = "md",
  isActive = true,
}: DealBadgeProps) {
  const theme = DEAL_THEMES[dealType];

  const sizeClasses = {
    sm: "px-2.5 py-1 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2",
  };

  const getBadgeText = (type: DealType): string => {
    switch (type) {
      case "voucher":
        return "Voucher";
      case "cold":
        return "Cold deals";
      case "original":
        return "Original deals";
      default:
        return "Deal";
    }
  };

  const Icon = dealType === "voucher" ? VoucherIcon : dealType === "original" ? ShoppingBagIcon : ColdIcon;

  return (
    <div
      className={`
        inline-flex items-center font-semibold rounded-full
        ${sizeClasses[size]}
        ${isActive ? "" : "opacity-50"}
        ${className}
      `}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      <Icon />
      {getBadgeText(dealType)}
    </div>
  );
}

export function SimpleDealBadge({
  dealType,
  className = "",
}: Omit<DealBadgeProps, "isActive">) {
  const theme = DEAL_THEMES[dealType];

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
      className={`inline-block font-bold ${className}`}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      {getBadgeText(dealType)}
    </span>
  );
}
