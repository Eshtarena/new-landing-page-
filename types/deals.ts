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

import { COLORS } from '../utils/colors';

export const DEAL_THEMES: Record<DealType, DealTheme> = {
  voucher: {
    primary: COLORS.voucherDeal, 
    secondary: `${COLORS.voucherDeal}30`, 
    badge: `${COLORS.voucherDeal}E6`, 
    progressBar: COLORS.voucherDeal,
    text: COLORS.darkViolet
  },
  cold: {
    primary: COLORS.darkViolet, 
    secondary: `${COLORS.darkViolet}30`, 
    badge: `${COLORS.darkViolet}E6`, 
    progressBar: COLORS.darkViolet,
    text: '#ffffff'
  },
  original: {
    primary: COLORS.originalDeal, 
    secondary: `${COLORS.originalDeal}30`, 
    badge: `${COLORS.originalDeal}E6`, 
    progressBar: COLORS.originalDeal,
    text: '#ffffff'
  }
}; 