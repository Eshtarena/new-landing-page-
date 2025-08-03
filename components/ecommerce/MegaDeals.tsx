import React from "react";
import { CompactDealCard } from "../deals/DealCard";
import { Deal } from "../../types/deals";
import { ALL_MOCK_DEALS } from "../../data/mockDeals";

export default function MegaDeals() {
  const handleDealClick = (deal: Deal) => {
    console.log("Deal clicked:", deal);
    // You can add navigation logic here
    // For example: router.push(`/deals/${deal.id}`);
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Deals Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_MOCK_DEALS.map((deal) => (
              <CompactDealCard
                key={deal.id}
                deal={deal}
                onCardClick={handleDealClick}
                className="transform hover:scale-105 transition-transform duration-200"
              />
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-[#340040] text-white font-medium rounded-lg hover:bg-[#340040] transition-colors">
              View All Deals
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
