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
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
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
    sm: "px-2.5 py-[5px] text-[10px] gap-1.5 font-semibold",
    md: "px-3 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-4 py-1.5 text-sm gap-2 font-semibold",
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
        inline-flex items-center rounded-full
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
