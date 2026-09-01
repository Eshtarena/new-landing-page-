import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { DealType, DEAL_THEMES } from "../../types/deals";
import { resolvePageLang } from "../../utils/resolvePageLang";

interface DealBadgeProps {
  dealType: DealType;
  className?: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

const BADGE_ICONS: Record<DealType, string> = {
  voucher: "/voucher.svg",
  cold: "/cold.svg",
  original: "/product.svg",
};

function BadgeIcon({ dealType, size }: { dealType: DealType; size: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg" ? "w-4 h-4" : size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";

  return (
    <img
      src={BADGE_ICONS[dealType]}
      alt=""
      aria-hidden="true"
      className={`${sizeClass} shrink-0`}
    />
  );
}

function getBadgeLabel(
  t: (key: string, options?: { defaultValue?: string }) => string,
  type: DealType,
  isRTL: boolean
): string {
  switch (type) {
    case "voucher":
      return t("deals.voucherDeal.badge", {
        defaultValue: isRTL ? "شراء جماعي | عرض كوبونات" : "Group buying | vouchers deal",
      });
    case "cold":
      return t("deals.coldDeal.badge", {
        defaultValue: isRTL ? "شراء مجمع | مزايدة" : "Group purchasing | Bidding",
      });
    case "original":
      return t("deals.productDeal.badge", {
        defaultValue: isRTL ? "شراء جماعي | عرض منتجات" : "Group buying | products deal",
      });
    default:
      return isRTL ? "عرض" : "Deal";
  }
}

export default function DealBadge({
  dealType,
  className = "",
  size = "md",
  isActive = true,
}: DealBadgeProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = resolvePageLang(router) === "ar";
  const theme = DEAL_THEMES[dealType];

  const sizeClasses = {
    sm: "px-2.5 py-[5px] text-[10px] gap-1.5 font-semibold",
    md: "px-3 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-4 py-1.5 text-sm gap-2 font-semibold",
  };

  return (
    <div
      className={`
        inline-flex items-center rounded-full max-w-full
        ${sizeClasses[size]}
        ${isActive ? "" : "opacity-50"}
        ${className}
      `}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      <BadgeIcon dealType={dealType} size={size} />
      {getBadgeLabel(t, dealType, isRTL)}
    </div>
  );
}

export function SimpleDealBadge({
  dealType,
  className = "",
}: Omit<DealBadgeProps, "isActive">) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = resolvePageLang(router) === "ar";
  const theme = DEAL_THEMES[dealType];

  return (
    <span
      className={`inline-block font-bold ${className}`}
      style={{
        backgroundColor: theme.badge,
        color: theme.text,
      }}
    >
      {getBadgeLabel(t, dealType, isRTL)}
    </span>
  );
}
