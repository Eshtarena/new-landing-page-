import React from "react";
import { DealQuantity, DealType, DEAL_THEMES } from "../../types/deals";

interface ProgressBarProps {
  quantity: DealQuantity;
  dealType: DealType;
  className?: string;
  showLabels?: boolean;
  height?: "sm" | "md" | "lg" | "xl";
  labels?: {
    progress?: string;
    total?: string;
    sold?: string;
    available?: string;
  };
  locale?: string;
}

export default function ProgressBar({
  quantity,
  dealType,
  className = "",
  showLabels = true,
  height = "md",
  labels = {
    progress: "Progress",
    total: "Total",
    sold: "Sold",
    available: "Available",
  },
  locale = "en",
}: ProgressBarProps) {
  const total = quantity.sold + quantity.available;
  const progressPercentage = total > 0 ? (quantity.sold / total) * 100 : 0;
  const theme = DEAL_THEMES[dealType];

  const heightClasses = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
    xl: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center text-xs text-primary-500 mb-1.5">
          <span>{labels.progress}</span>
          <span className="font-bold">
            {labels.total} {total.toLocaleString(locale)}
          </span>
        </div>
      )}

      <div
        className={`rounded-full overflow-hidden ${heightClasses[height]}`}
        style={{ backgroundColor: theme.secondary }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${Math.min(progressPercentage, 100)}%`,
            backgroundColor: theme.progressBar,
          }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between text-xs text-primary-500 mt-1.5">
          <span>
            {labels.sold} {quantity.sold.toLocaleString(locale)}
          </span>
          <span>
            {labels.available} {quantity.available.toLocaleString(locale)}
          </span>
        </div>
      )}
    </div>
  );
}

export function SimpleProgressBar({
  quantity,
  dealType,
  className = "",
  height = "sm",
  labels,
  locale,
}: Omit<ProgressBarProps, "showLabels">) {
  return (
    <ProgressBar
      quantity={quantity}
      dealType={dealType}
      className={className}
      showLabels={false}
      height={height}
      labels={labels}
      locale={locale}
    />
  );
}
