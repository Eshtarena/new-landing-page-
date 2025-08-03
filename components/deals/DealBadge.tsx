import React from 'react';
import { DealType, DEAL_THEMES } from '../../types/deals';

interface DealBadgeProps {
  dealType: DealType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export default function DealBadge({ 
  dealType, 
  className = '',
  size = 'md',
  isActive = true
}: DealBadgeProps) {
  const theme = DEAL_THEMES[dealType];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const getBadgeText = (type: DealType): string => {
    switch (type) {
      case 'voucher':
        return 'Voucher';
      case 'cold':
        return 'Cold';
      case 'original':
        return 'Original';
      default:
        return 'Deal';
    }
  };

  const getBadgeIcon = (type: DealType): React.ReactElement | null => {
    // Only show icons for larger sizes
    if (size === 'sm') return null;
    
    switch (type) {
      case 'voucher':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 'cold':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'original':
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        inline-flex items-center font-medium rounded-full
        ${sizeClasses[size]}
        ${isActive ? '' : 'opacity-50'}
        ${className}
      `}
      style={{ 
        backgroundColor: theme.badge,
        color: theme.text
      }}
    >
      {getBadgeIcon(dealType)}
      {getBadgeText(dealType)}
    </div>
  );
}

// Compact version without icon
export function SimpleDealBadge({ 
  dealType, 
  className = '', 
  size = 'sm' 
}: Omit<DealBadgeProps, 'isActive'>) {
  const theme = DEAL_THEMES[dealType];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const getBadgeText = (type: DealType): string => {
    switch (type) {
      case 'voucher':
        return 'Voucher';
      case 'cold':
        return 'Cold';
      case 'original':
        return 'Original';
      default:
        return 'Deal';
    }
  };

  return (
    <span 
      className={`
        inline-block font-bold rounded-md
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ 
        backgroundColor: theme.badge,
        color: theme.text
      }}
    >
      {getBadgeText(dealType)}
    </span>
  );
} 