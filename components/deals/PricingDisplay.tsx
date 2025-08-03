import React from 'react';
import { Deal, DealType, DEAL_THEMES } from '../../types/deals';

interface PricingDisplayProps {
  deal: Deal;
  className?: string;
  showSavings?: boolean;
  layout?: 'horizontal' | 'vertical' | 'compact';
}

export default function PricingDisplay({ 
  deal, 
  className = '',
  showSavings = true,
  layout = 'horizontal'
}: PricingDisplayProps) {
  const theme = DEAL_THEMES[deal.dealType];
  
  const formatCurrency = (amount: number, currency: string): string => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const renderVoucherPricing = (voucherDeal: Deal & { voucherValue: number }) => (
    <div className={`${layout === 'vertical' ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Voucher value</span>
        <span className="text-lg font-semibold text-gray-800">
          {formatCurrency(voucherDeal.voucherValue, voucherDeal.currency)}
        </span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-500">Deal Price</span>
        <span className="text-xl font-bold" style={{ color: theme.primary }}>
          {formatCurrency(voucherDeal.dealPrice, voucherDeal.currency)}
        </span>
      </div>
      
      {showSavings && (
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Save</span>
          <span className="text-lg font-semibold text-green-600">
            {formatCurrency(voucherDeal.saveAmount, voucherDeal.currency)}
          </span>
        </div>
      )}
    </div>
  );

  const renderMarketPricing = (marketDeal: Deal & { marketPrice: number }) => (
    <div className={`${layout === 'vertical' ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Market price</span>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-800">
            {formatCurrency(marketDeal.marketPrice, marketDeal.currency)}
          </span>
          {deal.dealType === 'cold' && (
            <svg className="w-4 h-4 ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-500">Deal Price</span>
        <span className="text-xl font-bold" style={{ color: theme.primary }}>
          {formatCurrency(marketDeal.dealPrice, marketDeal.currency)}
        </span>
      </div>
      
      {showSavings && (
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Save</span>
          <span className="text-lg font-semibold text-green-600">
            {formatCurrency(marketDeal.saveAmount, marketDeal.currency)}
          </span>
        </div>
      )}
    </div>
  );

  const renderCompactPricing = () => (
    <div className="grid grid-cols-3 gap-2 text-center">
      {/* Market Price / Voucher Value */}
      <div>
        {'voucherValue' in deal ? (
          <>
            <div className="text-xs text-gray-500 mb-1">Voucher value</div>
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(deal.voucherValue, deal.currency)}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-1">Market price</div>
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency((deal as any).marketPrice || deal.dealPrice + deal.saveAmount, deal.currency)}
            </div>
          </>
        )}
      </div>
      
      {/* Deal Price - Prominent */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Deal Price</div>
        <div 
          className="text-lg font-bold"
          style={{ color: theme.primary }}
        >
          {formatCurrency(deal.dealPrice, deal.currency)}
        </div>
      </div>

      {/* Savings */}
      {showSavings && (
        <div>
          <div className="text-xs text-gray-500 mb-1">Save</div>
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(deal.saveAmount, deal.currency)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`${className}`}>
      {layout === 'compact' ? (
        renderCompactPricing()
      ) : deal.dealType === 'voucher' ? (
        renderVoucherPricing(deal as Deal & { voucherValue: number })
      ) : (
        renderMarketPricing(deal as Deal & { marketPrice: number })
      )}
    </div>
  );
}

// Simplified pricing for minimal layouts
export function SimplePricingDisplay({ 
  deal, 
  className = '' 
}: Pick<PricingDisplayProps, 'deal' | 'className'>) {
  const theme = DEAL_THEMES[deal.dealType];
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-xl font-bold" style={{ color: theme.primary }}>
        {deal.dealPrice.toLocaleString()} {deal.currency}
      </span>
      <span className="text-sm text-green-600 font-medium">
        Save {deal.saveAmount.toLocaleString()} {deal.currency}
      </span>
    </div>
  );
} 