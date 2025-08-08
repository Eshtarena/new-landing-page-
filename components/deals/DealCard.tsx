import React from "react";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { DealCardProps } from "../../types/deals";
import { COLORS } from "../../utils/colors";

export function CompactDealCard({
  deal,
  className = "",
  onCardClick,
}: Omit<DealCardProps, "showFullDetails">) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer max-w-md mx-auto w-full ${className}`}
      onClick={() => onCardClick?.(deal)}
    >
      {/* Product Image */}
      <ImageCarousel
        images={deal.images}
        aspectRatio="video"
        autoScroll
        showDots={false}
        showArrows={false}
        className="h-48"
      />

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title & Timer */}
        <div className="flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-medium truncate"
              style={{ color: COLORS.darkViolet }}
            >
              {deal.title}
            </h2>
            <p
              className="text-xs truncate"
              style={{ color: COLORS.darkViolet }}
            >
              {deal.description}
            </p>
          </div>
          <CountdownTimer
            timer={deal.timer}
            textColor="text-blue-600"
            className="text-sm scale-75 origin-right flex-shrink-0"
          />
        </div>

        {/* Location & Badge */}
        <div className="flex justify-between text-xs text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {deal.location.text}
          </div>
          <DealBadge
            dealType={deal.dealType}
            size="sm"
            isActive={deal.isActive}
            className="px-4 py-1.5"
          />
        </div>

        {/* Progress Bar */}
        <ProgressBar
          quantity={deal.quantity}
          dealType={deal.dealType}
          showLabels
          height="lg"
          className="text-sm"
        />

        {/* Pricing */}
        <PricingDisplay
          deal={deal}
          layout="compact"
          showSavings
          className="text-sm"
        />
      </div>
    </div>
  );
}
