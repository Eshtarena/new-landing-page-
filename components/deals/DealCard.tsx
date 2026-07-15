import React from "react";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { DealCardProps } from "../../types/deals";

function SupplierLogo({
  logoUrl,
  supplierName,
}: {
  logoUrl?: string;
  supplierName?: string;
}) {
  const initials = (supplierName || "S").slice(0, 2).toUpperCase();

  return (
    <div className="relative w-10 h-10 shrink-0 -rotate-6">
      <div className="w-full h-full rounded-lg overflow-hidden bg-primary-500 shadow-sm flex items-center justify-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={supplierName || "Supplier"}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[9px] font-bold text-white leading-none text-center px-0.5">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DealCard({
  deal,
  className = "",
  onCardClick,
}: Omit<DealCardProps, "showFullDetails">) {
  const secondaryLine =
    deal.dealType === "voucher" ? deal.id : deal.description || deal.id;
  const tertiaryLine =
    deal.dealType === "voucher" ? deal.description : deal.productName;

  return (
    <div
      className={`bg-white rounded-2xl shadow-soft border border-black/5 overflow-hidden transition-all duration-300 ease-spring hover:shadow-soft-lg cursor-pointer max-w-md mx-auto w-full ${className}`}
      onClick={() => onCardClick?.(deal)}
    >
      {/* Product Image */}
      <div className="p-3 pb-0">
        <ImageCarousel
          images={deal.images}
          aspectRatio="video"
          autoScroll={deal.images.length > 1}
          autoScrollInterval={3000}
          showDots={false}
          showArrows={false}
          className="rounded-xl"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-3">
        {/* Supplier logo + title */}
        <div className="flex gap-2.5 items-start">
          <SupplierLogo logoUrl={deal.supplierLogo} supplierName={deal.supplier} />
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="text-sm font-bold tracking-tight truncate text-primary-500">
              {deal.title}
            </h2>
            <p className="text-xs font-semibold truncate text-primary-500 mt-0.5">
              {secondaryLine}
            </p>
            {tertiaryLine && (
              <p className="text-[11px] leading-tight truncate text-gray-400 mt-0.5">
                {tertiaryLine}
              </p>
            )}
          </div>
        </div>

        {/* Badge, location & timer */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <DealBadge
              dealType={deal.dealType}
              size="sm"
              isActive={deal.isActive}
            />
            <div className="flex items-center text-[10px] text-primary-500">
              <svg
                className="w-3 h-3 mr-1 shrink-0 text-primary-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{deal.location.text}</span>
            </div>
          </div>
          <CountdownTimer
            timer={deal.timer}
            textColor="text-blue-600"
          />
        </div>

        {/* Pricing */}
        <PricingDisplay deal={deal} />

        {/* Progress */}
        <ProgressBar
          quantity={deal.quantity}
          dealType={deal.dealType}
          showLabels
          height="md"
        />
      </div>
    </div>
  );
}
