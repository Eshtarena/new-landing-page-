import React from 'react';
import DealCard from './DealCard';
import { Deal } from '../../types/deals';
import { getMockVoucherDeals, getMockColdDeals, getMockOriginalDeals } from '../../data/mockDeals';

interface DealCardShowcaseProps {
  onDealClick?: (deal: Deal) => void;
}

export default function DealCardShowcase({ onDealClick }: DealCardShowcaseProps) {
  // Get sample deals from mock data
  const voucherDeals = getMockVoucherDeals();
  const coldDeals = getMockColdDeals();
  const originalDeals = getMockOriginalDeals();

  const sampleVoucherDeal = voucherDeals[0];
  const sampleColdDeal = coldDeals[0];
  const sampleOriginalDeal = originalDeals[0];

  const handleDealClick = (deal: Deal) => {
    console.log('Deal clicked:', deal);
    if (onDealClick) {
      onDealClick(deal);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Deal Card Components Showcase</h1>
      
      {/* Compact Deal Cards - Main Display */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Deal Cards Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DealCard 
            deal={sampleVoucherDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleColdDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleOriginalDeal} 
            onCardClick={handleDealClick}
          />
        </div>
      </section>

      {/* Compact Deal Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compact Deal Cards</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DealCard 
            deal={sampleVoucherDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleColdDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleOriginalDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={{ ...sampleVoucherDeal, isActive: false }} 
            onCardClick={handleDealClick}
          />
        </div>
      </section>

      {/* Compact Deal Cards - Grid Layout */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Grid Layout</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DealCard 
            deal={sampleVoucherDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleColdDeal} 
            onCardClick={handleDealClick}
          />
          <DealCard 
            deal={sampleOriginalDeal} 
            onCardClick={handleDealClick}
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Component Features:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Three Deal Types:</strong> Voucher (green), Cold (purple), Original (red)</li>
            <li>✅ <strong>Responsive Design:</strong> Full, Compact, and Minimal layouts</li>
            <li>✅ <strong>Interactive Elements:</strong> Hover effects, click handlers</li>
            <li>✅ <strong>Auto-updating Timers:</strong> Real-time countdown display</li>
            <li>✅ <strong>Image Carousels:</strong> Multiple images with auto-scroll</li>
            <li>✅ <strong>Progress Tracking:</strong> Color-coded quantity indicators</li>
            <li>✅ <strong>Flexible Pricing:</strong> Different layouts for different deal types</li>
            <li>✅ <strong>Status Handling:</strong> Active/inactive deal states</li>
            <li>✅ <strong>Modular Components:</strong> Each sub-component can be used independently</li>
            <li>✅ <strong>Separated Data:</strong> Mock data is completely separated from UI components</li>
          </ul>
        </div>
      </section>
    </div>
  );
} 