import React from "react";
import { Deal, DEAL_THEMES } from "../../types/deals";
import { COLORS } from "../../utils/colors";

interface PricingDisplayProps {
  deal: Deal;
  className?: string;
  showSavings?: boolean;
  layout?: "horizontal" | "vertical" | "compact";
  labels?: {
    voucherValue: string;
    marketPrice: string;
    dealPrice: string;
    save: string;
  };
  locale?: string;
}

const SaudiRiyalIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 1124.14 1256.39"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
  </svg>
);

const PriceItem = ({
  label,
  value,
  accentColor,
  isSave = false,
}: {
  label: string;
  value: string;
  accentColor?: string;
  isSave?: boolean;
}) => {
  const color = isSave ? accentColor : COLORS.darkViolet;

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-2 px-1 min-w-0">
      <span
        className="text-[10px] mb-1 text-center"
        style={{ color: isSave ? accentColor : "#9CA3AF" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-0.5" style={{ color }}>
        <span className={`text-sm font-bold tabular-nums leading-none ${isSave ? "" : ""}`}>
          {value}
        </span>
        <SaudiRiyalIcon className="w-2.5 h-2.5 shrink-0" />
      </div>
    </div>
  );
};

export default function PricingDisplay({
  deal,
  className = "",
  labels = {
    voucherValue: "Voucher value",
    marketPrice: "Market price",
    dealPrice: "Deal Price",
    save: "Save",
  },
  locale = "en",
}: PricingDisplayProps) {
  const theme = DEAL_THEMES[deal.dealType];

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString(locale);
  };

  const referencePrice =
    "voucherValue" in deal
      ? deal.voucherValue
      : deal.marketPrice || deal.dealPrice + deal.saveAmount;

  const referenceLabel =
    "voucherValue" in deal ? labels.voucherValue : labels.marketPrice;

  const items = [
    {
      label: referenceLabel,
      value: formatAmount(referencePrice),
      isSave: false,
    },
    {
      label: labels.dealPrice,
      value: formatAmount(deal.dealPrice),
      isSave: false,
    },
    {
      label: labels.save,
      value: formatAmount(deal.saveAmount),
      isSave: true,
    },
  ];

  return (
    <div
      className={`flex flex-row items-stretch border border-gray-200 rounded-xl overflow-hidden ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <PriceItem
            label={item.label}
            value={item.value}
            accentColor={theme.primary}
            isSave={item.isSave}
          />
          {index < items.length - 1 && (
            <div className="w-px bg-gray-200 self-stretch my-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function SimplePricingDisplay({
  deal,
  className = "",
  labels = {
    save: "Save",
    voucherValue: "Voucher value",
    marketPrice: "Market price",
    dealPrice: "Deal Price",
  },
  locale = "en",
}: Pick<PricingDisplayProps, "deal" | "className" | "labels" | "locale">) {
  const theme = DEAL_THEMES[deal.dealType];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1" style={{ color: theme.primary }}>
        <span className="text-lg font-bold">
          {deal.dealPrice.toLocaleString(locale)}
        </span>
        <SaudiRiyalIcon className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-1" style={{ color: theme.primary }}>
        <span className="text-xs font-medium">
          {labels.save} {deal.saveAmount.toLocaleString(locale)}
        </span>
        <SaudiRiyalIcon className="w-2.5 h-2.5 opacity-80" />
      </div>
    </div>
  );
}
