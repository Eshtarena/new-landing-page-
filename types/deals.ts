// Deal card types based on the three deal variants shown in the UI

export type DealType = 'voucher' | 'cold' | 'original';

export interface BaseLocation {
  text: string;
  icon?: string;
}

export interface DealTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface DealQuantity {
  sold: number;
  available: number;
}

export interface DealImage {
  src: string;
  alt: string;
}

export interface BaseDeal {
  id: string;
  title: string;
  description?: string;
  images: DealImage[];
  dealType: DealType;
  timer: DealTimer;
  location: BaseLocation;
  quantity: DealQuantity;
  dealPrice: number;
  saveAmount: number;
  currency: string;
  isActive: boolean;
}

export interface VoucherDeal extends BaseDeal {
  dealType: 'voucher';
  voucherValue: number;
}

export interface ColdDeal extends BaseDeal {
  dealType: 'cold';
  marketPrice: number;
  priceChangeIndicator?: 'up' | 'down' | 'stable';
}

export interface OriginalDeal extends BaseDeal {
  dealType: 'original';
  marketPrice: number;
}

export type Deal = VoucherDeal | ColdDeal | OriginalDeal;

export interface DealCardProps {
  deal: Deal;
  className?: string;
  onCardClick?: (deal: Deal) => void;
  showFullDetails?: boolean;
}

// Theme configuration for each deal type
export interface DealTheme {
  primary: string;
  secondary: string;
  badge: string;
  progressBar: string;
  text: string;
}

export const DEAL_THEMES: Record<DealType, DealTheme> = {
  voucher: {
    primary: '#10B981', // green-500
    secondary: '#ECFDF5', // green-50
    badge: '#059669', // green-600
    progressBar: '#10B981',
    text: '#ffffff'
  },
  cold: {
    primary: '#581C87', // purple-900
    secondary: '#F3E8FF', // purple-50
    badge: '#6B21A8', // purple-800
    progressBar: '#581C87',
    text: '#ffffff'
  },
  original: {
    primary: '#DC2626', // red-600
    secondary: '#FEF2F2', // red-50
    badge: '#B91C1C', // red-700
    progressBar: '#DC2626',
    text: '#ffffff'
  }
}; 