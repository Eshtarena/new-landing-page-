// Deal card types based on the three deal variants shown in the UI

import type { AdviceArticle } from "./advice";

export type DealType = 'voucher' | 'cold' | 'original';

export interface BaseLocation {
  text: string;
  icon?: string;
}

export interface DealCityCoverage {
  city: string;
  districts: string[];
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

export interface DealTermItem {
  title: string;
  content: string;
}

export interface VoucherPaymentTerm {
  title: string;
  description: string;
}

export interface DealDetailContent {
  about?: string;
  /** Deal-level special specs text from API `specialSpecification`. */
  specialSpecification?: string;
  terms?: string;
  paymentTerms?: string;
  deliveryTerms?: string[];
  customerPaymentTerms?: DealTermItem[];
  /** Optional purchasing expert advice when provided by the API. */
  purchasingExpertAdvice?: string;
}

export interface BaseDeal {
  id: string;
  title: string;
  description?: string;
  images: DealImage[];
  dealType: DealType;
  timer: DealTimer;
  location: BaseLocation;
  /** When true, the deal is available across all of KSA. */
  allKsa?: boolean;
  /** Cities and districts where the deal is available (when not all KSA). */
  cities?: DealCityCoverage[];
  quantity: DealQuantity;
  dealPrice: number;
  saveAmount: number;
  currency: string;
  isActive: boolean;
  /** From API: "On going" | "Ended". When set, UI shows this instead of Active/Inactive. */
  statusLabel?: "On going" | "Ended";
  category?: string;
  supplier?: string;
  supplierLogo?: string;
  /** Backend supplier id, when present — links the DealSupplierSection to a supplier profile. */
  supplierId?: string;
  productName?: string;
  /** Product factory name from API `product.factory_en/ar`. */
  productFactory?: string;
  /** Product country of origin from API `product.country_en/ar`. */
  productMadeIn?: string;
  detailContent?: DealDetailContent;
  /** Linked purchasing expert advice when returned by the deal details API. */
  advice?: AdviceArticle;
}

export interface VoucherDeal extends BaseDeal {
  dealType: 'voucher';
  voucherValue: number;
  /** From API: expireDate e.g. "2026-04-10" */
  expireDate?: string;
  /** From API: customerPaymentTerms */
  paymentTerms?: VoucherPaymentTerm[];
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
    badge: COLORS.voucherDeal, 
    progressBar: COLORS.voucherDeal,
    text: '#ffffff'
  },
  cold: {
    primary: COLORS.darkViolet, 
    secondary: `${COLORS.darkViolet}30`, 
    badge: COLORS.darkViolet, 
    progressBar: COLORS.darkViolet,
    text: '#ffffff'
  },
  original: {
    primary: COLORS.originalDeal, 
    secondary: `${COLORS.originalDeal}30`, 
    badge: COLORS.originalDeal, 
    progressBar: COLORS.originalDeal,
    text: '#ffffff'
  }
}; 