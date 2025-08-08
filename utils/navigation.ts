import { Deal } from '../types/deals';

/**
 * Navigate to deal details page
 * @param router - Next.js router instance
 * @param deal - Deal object
 */
export const navigateToDealDetails = (router: any, deal: Deal) => {
  router.push(`/deal-details/${deal.id}`);
};

/**
 * Get deal details URL
 * @param dealId - Deal ID
 * @returns URL string for deal details page
 */
export const getDealDetailsUrl = (dealId: string) => {
  return `/deal-details/${dealId}`;
};

/**
 * Handle deal click with consistent logging and navigation
 * @param router - Next.js router instance
 * @param deal - Deal object
 * @param source - Source component name for analytics
 */
export const handleDealClick = (router: any, deal: Deal, source?: string) => {
  if (source) {
    console.log(`Deal clicked from ${source}:`, deal);
  } else {
    console.log('Deal clicked:', deal);
  }
  
  navigateToDealDetails(router, deal);
};