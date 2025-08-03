// Main Deal Card Components
export { default as DealCard, CompactDealCard, MinimalDealCard } from './DealCard';

// Sub-components
export { default as ImageCarousel, CompactImageCarousel } from './ImageCarousel';
export { default as CountdownTimer, CompactCountdownTimer } from './CountdownTimer';
export { default as ProgressBar, SimpleProgressBar } from './ProgressBar';
export { default as DealBadge, SimpleDealBadge } from './DealBadge';
export { default as PricingDisplay, SimplePricingDisplay } from './PricingDisplay';

// Types
export type {
  Deal,
  VoucherDeal,
  ColdDeal,
  OriginalDeal,
  DealType,
  DealCardProps,
  DealTimer,
  DealQuantity,
  DealImage,
  BaseLocation,
  DealTheme
} from '../../types/deals';

export { DEAL_THEMES } from '../../types/deals'; 