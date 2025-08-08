import React from "react";
import { Deal, DEAL_THEMES } from "../../types/deals";
import { COLORS } from "../../utils/colors";

interface PricingDisplayProps {
  deal: Deal;
  className?: string;
  showSavings?: boolean;
  layout?: "horizontal" | "vertical" | "compact";
}

// Reusable price item component
const PriceItem = ({
  label,
  value,
  size = "normal",
  alignment = "left",
}: {
  label: string;
  value: string;
  size?: "small" | "normal" | "large";
  alignment?: "left" | "center" | "right";
}) => {
  const sizeClasses = {
    small: "text-sm",
    normal: "text-lg",
    large: "text-xl font-semibold",
  };

  return (
    <div className={`flex flex-col justify-start items-center w-[30%]`}>
      <span className="text-sm" style={{ color: COLORS.darkViolet }}>
        {label}
      </span>
      <span
        className={`${sizeClasses[size]} font-normal`}
        style={{ color: COLORS.darkViolet }}
      >
        {value}
      </span>
    </div>
  );
};

export default function PricingDisplay({
  deal,
  className = "",
  showSavings = true,
  layout = "horizontal",
}: PricingDisplayProps) {
  const formatCurrency = (amount: number, currency: string): string => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  // Calculate reference price (voucher value or market price)
  const referencePrice =
    "voucherValue" in deal
      ? deal.voucherValue
      : (deal as any).marketPrice || deal.dealPrice + deal.saveAmount;

  const referenceLabel =
    "voucherValue" in deal ? "Voucher value" : "Market price";

  const items = [
    {
      label: referenceLabel,
      value: formatCurrency(referencePrice, deal.currency),
      size: "small" as const,
    },
    {
      label: "Deal Price",
      value: formatCurrency(deal.dealPrice, deal.currency),
      size: "large" as const,
    },
    {
      label: "Save",
      value: formatCurrency(deal.saveAmount, deal.currency),
      size: "small" as const,
    },
  ];

  return (
    <div className="flex flex-col">
      <div
        className="w-full h-[1px] rounded-full mb-2"
        style={{
          background: `linear-gradient(to right, white, ${COLORS.darkViolet}, white)`,
        }}
      ></div>

      <div className={`flex flex-row justify-between ${className}`}>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <PriceItem
              label={item.label}
              value={item.value}
              size={item.size}
              alignment={
                layout === "compact" ? "center" : index === 0 ? "left" : "right"
              }
            />
            {/* Add divider line between items (except after last item) */}
            {index < items.length - 1 && layout !== "vertical" && (
              <div
                className="w-[1px] h-12 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, white, ${COLORS.darkViolet}, white)`,
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
// Simplified pricing for minimal layouts
export function SimplePricingDisplay({
  deal,
  className = "",
}: Pick<PricingDisplayProps, "deal" | "className">) {
  const theme = DEAL_THEMES[deal.dealType];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-xl font-bold" style={{ color: theme.primary }}>
        {deal.dealPrice.toLocaleString()} {deal.currency}
      </span>
      <span className="text-sm font-medium" style={{ color: theme.primary }}>
        Save {deal.saveAmount.toLocaleString()} {deal.currency}
      </span>
    </div>
  );
}

