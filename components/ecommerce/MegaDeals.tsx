import React from 'react';
import { CompactDealCard } from '../deals/DealCard';
import { Deal } from '../../types/deals';
import { MOCK_MEGA_DEALS_BY_CATEGORY } from '../../data/mockDeals';

interface CategoryDeals {
  title: string;
  deals: Deal[];
}

export default function MegaDeals() {
  const handleDealClick = (deal: Deal) => {
    console.log('Deal clicked:', deal);
    // You can add navigation logic here
    // For example: router.push(`/deals/${deal.id}`);
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Mega Deals
        </h2>
        
        <div className="space-y-12">
          {Object.entries(MOCK_MEGA_DEALS_BY_CATEGORY).map(([categoryKey, category]) => (
            category.deals.length > 0 && (
              <div key={categoryKey} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    {category.title}
                  </h3>
                  <p className="text-purple-100 text-sm">
                    {category.deals.length} amazing deals available
                  </p>
                </div>
                
                {/* Deals Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.deals.map((deal) => (
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
                    <button className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                      View All {category.title}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        
       
      </div>
    </div>
  );
} 