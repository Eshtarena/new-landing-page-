import React from 'react';
import { DealQuantity, DealType, DEAL_THEMES } from '../../types/deals';

interface ProgressBarProps {
  quantity: DealQuantity;
  dealType: DealType;
  className?: string;
  showLabels?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ 
  quantity, 
  dealType, 
  className = '',
  showLabels = true,
  height = 'md'
}: ProgressBarProps) {
  const total = quantity.sold + quantity.available;
  const progressPercentage = total > 0 ? (quantity.sold / total) * 100 : 0;
  const theme = DEAL_THEMES[dealType];
  
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-gray-600 mb-2">
          <span className="text-sm">{quantity.sold} Sold</span>
          <span className="text-sm">{quantity.available} Available</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div 
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${Math.min(progressPercentage, 100)}%`,
            backgroundColor: theme.progressBar
          }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-center mt-1">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% sold
          </span>
        </div>
      )}
    </div>
  );
}

// Simplified version without labels for compact layouts
export function SimpleProgressBar({ 
  quantity, 
  dealType, 
  className = '',
  height = 'sm'
}: Omit<ProgressBarProps, 'showLabels'>) {
  return (
    <ProgressBar 
      quantity={quantity}
      dealType={dealType}
      className={className}
      showLabels={false}
      height={height}
    />
  );
} 