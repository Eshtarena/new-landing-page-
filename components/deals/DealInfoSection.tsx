import React from "react";
import { Deal } from "../../types/deals";
import { COLORS } from "../../utils/colors";
import ImageCarousel from "./ImageCarousel";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";

interface DealInfoSectionProps {
  deal: Deal;
}

export default function DealInfoSection({ deal }: DealInfoSectionProps) {
  const handleJoinDeal = () => {
    // Handle join deal logic
    console.log("Joining deal:", deal.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Deal Image Carousel */}
      <div className="mb-6">
        <ImageCarousel
          images={deal.images}
          autoScroll={true} // enable auto scroll
          autoScrollInterval={3000} // scroll every 3 seconds
          showDots={false}
          showArrows={false}
          className="h-80 w-full"
        />
      </div>

      {/* Deal Name and Description */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: COLORS.darkViolet }}
              >
                {deal.title}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {deal.description}
              </p>
            </div>
          </div>
        </div>
        {/* Timer */}
        <div className="mb-6">
          <CountdownTimer
            timer={deal.timer}
            textColor="text-blue-600"
            className="text-lg"
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-row mb-6">
        {/* Location */}
        
          <div className="flex items-center" style={{ color: COLORS.darkViolet }}>
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-medium">{deal.location.text}</span>
          </div>
        
        {/* Deal Badge */}
        <div className="ml-4 flex-shrink-0">
          <DealBadge
            dealType={deal.dealType}
            size="lg"
            isActive={deal.isActive}
          />
        </div>
      </div>
  {/* Progress Bar - Based on Deal Type */}
  <div className="mb-8">
        <ProgressBar
          quantity={deal.quantity}
          dealType={deal.dealType}
          showLabels={true}
          height="lg"
          className="text-base"
        />
      </div>
      {/* Pricing */}
      <div className="mb-8">
        <PricingDisplay
          deal={deal}
          showSavings={true}
          layout="horizontal"
          className="bg-gray-50 rounded-lg p-4"
        />
      </div>

    

      {/* Join Deal Button */}
      <div className="space-y-4">
        <button
          onClick={handleJoinDeal}
          className="w-full py-4 px-6 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          style={{
            backgroundColor: COLORS.originalDeal,
            boxShadow: `0 4px 14px 0 ${COLORS.originalDeal}40`,
          }}
        >
          Join Deal
        </button>
      </div>
    </div>
  );
}
