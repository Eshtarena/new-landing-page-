import { Deal } from '../types/deals';

/**
 * Get deal details URL for shared links (type-specific paths under /v1)
 * - Voucher: /v1/deal/voucher/:voucherid
 * - Cold: /v1/deal/cold/:dealid
 * - Original: /v1/deal/original/:dealid
 */
export const getDealDetailsUrl = (deal: Deal): string => {
  console.log('deal', deal);
  switch (deal.dealType) {
    case 'voucher':
      return `/v1/deal/voucher/${deal.id}`;
    case 'cold':
      return `/v1/deal/cold/${deal.id}`;
    case 'original':
      return `/v1/deal/original/${deal.id}`;
    default: {
      const d = deal as Deal;
      return `/v1/deal/original/${d.id}`;
    }
  }
};

/**
 * Navigate to deal details page (type-specific route for sharing)
 * @param router - Next.js router instance
 * @param deal - Deal object
 */
export const navigateToDealDetails = (router: any, deal: Deal) => {
  router.push(getDealDetailsUrl(deal));
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