import React from "react";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { DealCardProps, DEAL_THEMES } from "../../types/deals";

export default function DealCard({
  deal,
  className = "",
  onCardClick,
  showFullDetails = true,
}: DealCardProps) {
  const theme = DEAL_THEMES[deal.dealType];

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(deal);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 
        hover:shadow-xl hover:scale-[1.02] cursor-pointer
        ${!deal.isActive ? "opacity-75 grayscale" : ""}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Header with Logo/Brand */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="flex items-center">
          {/* Logo placeholder - you can replace with actual logo component */}
          <div className="text-white font-bold text-lg">al-dawaa</div>
        </div>

        <DealBadge
          dealType={deal.dealType}
          size="sm"
          isActive={deal.isActive}
        />
      </div>

      {/* Product Image */}
      <div className="relative">
        <ImageCarousel
          images={deal.images}
          aspectRatio="video"
          autoScroll={true}
          showDots={deal.images.length > 1}
          showArrows={false}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {deal.title}
          </h3>
          {deal.description && showFullDetails && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {deal.description}
            </p>
          )}
        </div>

        {/* Timer and Location */}
        <div className="flex flex-row items-center justify-between mb-4 ">
          <CountdownTimer timer={deal.timer} textColor="text-gray-700" />
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-1"
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
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar
            quantity={deal.quantity}
            dealType={deal.dealType}
            showLabels={showFullDetails}
          />
        </div>

        {/* Pricing */}
        <PricingDisplay
          deal={deal}
          layout={showFullDetails ? "horizontal" : "compact"}
          showSavings={showFullDetails}
        />
      </div>

      {/* Status Indicator */}
      {!deal.isActive && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-lg">
            <span className="text-gray-700 font-medium">Deal Ended</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for grid layouts - RESTRUCTURED to match the image
export function CompactDealCard({
  deal,
  className = "",
  onCardClick,
}: Omit<DealCardProps, "showFullDetails">) {
  const theme = DEAL_THEMES[deal.dealType];

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 
        hover:shadow-xl hover:scale-[1.02] cursor-pointer max-w-md mx-auto w-full
        ${!deal.isActive ? "opacity-75" : ""}
        ${className}
      `}
      onClick={() => onCardClick?.(deal)}
    >
      {/* Product Image */}
      <div className="relative">
        <ImageCarousel
          images={deal.images}
          aspectRatio="video"
          autoScroll={true}
          showDots={false}
          showArrows={false}
          className="h-48"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title and Deal Type on same row */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900 truncate">
            {deal.title}
          </h2>
          <DealBadge
            dealType={deal.dealType}
            size="sm"
            isActive={deal.isActive}
            className="ml-2 flex-shrink-0"
          />
        </div>

        {/* Timer and Location on same row */}
        <div className="flex items-center justify-between mb-4">
          {/* Compact Timer using reusable component */}
          <div className="scale-75 origin-left">
            <CountdownTimer
              timer={deal.timer}
              textColor="text-blue-600"
              className="text-sm"
            />
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
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
            <span className="text-xs">{deal.location.text}</span>
          </div>
        </div>

        {/* Progress Bar using reusable component */}
        <div className="mb-4">
          <ProgressBar
            quantity={deal.quantity}
            dealType={deal.dealType}
            showLabels={true}
            height="sm"
            className="text-sm"
          />
        </div>

        {/* Pricing using reusable component */}
        <div className="border-t border-gray-200 pt-3">
          <PricingDisplay
            deal={deal}
            layout="compact"
            showSavings={true}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Minimal card for lists
export function MinimalDealCard({
  deal,
  className = "",
  onCardClick,
}: Omit<DealCardProps, "showFullDetails">) {
  const theme = DEAL_THEMES[deal.dealType];

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden 
        transition-all duration-300 hover:shadow-md cursor-pointer
        ${!deal.isActive ? "opacity-75" : ""}
        ${className}
      `}
      onClick={() => onCardClick?.(deal)}
    >
      <div className="flex">
        {/* Small Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={deal.images[0]?.src}
            alt={deal.images[0]?.alt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
              {deal.title}
            </h4>
            <DealBadge dealType={deal.dealType} size="sm" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>
              {deal.quantity.sold} sold of{" "}
              {deal.quantity.sold + deal.quantity.available}
            </span>
            <span>{deal.location.text}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold" style={{ color: theme.primary }}>
              {deal.dealPrice.toLocaleString()} {deal.currency}
            </span>
            <span className="text-green-600 text-xs">
              Save {deal.saveAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
