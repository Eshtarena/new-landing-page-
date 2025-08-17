import React, { useState } from "react";
import { useRouter } from "next/router";
import DealCard from "../deals/DealCard";
import { Deal } from "../../types/deals";
import { ALL_MOCK_DEALS } from "../../data/mockDeals";
import { handleDealClick } from "../../utils/navigation";
import FilterComponent from "./FilterComponent";
import MobileNavbar from "./MobileNavbar";
import MobileBottomNav from "./MobileBottomNav";
import { useDealsFilter } from "../../hooks/useDealsFilter";

export default function MegaDeals() {
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { filters, setFilters, filteredDeals, totalDeals, filteredCount } = useDealsFilter(ALL_MOCK_DEALS);
  
  // Check if we're on mobile (you might want to use a proper hook for this)
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const onDealClick = (deal: Deal) => {
    handleDealClick(router, deal, "MegaDeals");
  };

  return (
    <div className={`${isMobile ? '' : 'py-8'} bg-gray-50 min-h-screen`}>
    
      
      <div className={`container mx-auto ${isMobile ? 'px-4 pt-4' : 'px-4'}`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          {!isMobile && (
            <div className="w-80 flex-shrink-0">
              <FilterComponent
                onFilterChange={setFilters}
                initialFilters={filters}
                isMobile={false}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header - Desktop only */}
            {!isMobile && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Deals</h2>
                <p className="text-sm text-gray-600">
                  Showing {filteredCount} of {totalDeals} deals
                </p>
              </div>
            )}



            {/* Deals Grid */}
            {filteredDeals.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 ${isMobile ? 'pb-20' : ''}`}>
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onCardClick={onDealClick}
                    className="transform hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isMobile ? 'pb-20' : ''}`}>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}

            {/* View All Link - Desktop only */}
            {!isMobile && filteredDeals.length > 0 && (
              <div className="mt-8 text-center">
                <button className="inline-flex items-center px-6 py-3 bg-[#340040] text-white font-medium rounded-lg hover:bg-[#340040]/90 transition-colors">
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
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobile && (
          <FilterComponent
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            onFilterChange={setFilters}
            initialFilters={filters}
            isMobile={true}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav activeTab="home" />}
    </div>
  );
}
