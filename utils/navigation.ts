import { NextRouter } from 'next/router';
import { Deal } from '../types/deals';

const normalizeRouteParam = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const resolveRouteContext = (router: NextRouter) => {
  const langFromQuery = normalizeRouteParam(router.query.lang);
  const countryCodeFromQuery = normalizeRouteParam(router.query.countryCode);
  const lang = langFromQuery || router.locale || 'en';
  return {
    lang,
    countryCode: countryCodeFromQuery,
  };
};

/**
 * Get deal details URL for shared links (type-specific paths under /v1)
 * - Voucher: /v1/deal/voucher/:voucherid
 * - Cold: /v1/deal/cold/:dealid
 * - Original: /v1/deal/original/:dealid
 */
export const getSharedDealDetailsUrl = (deal: Deal): string => {
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
export const navigateToDealDetails = (router: NextRouter, deal: Deal) => {
  const { lang, countryCode } = resolveRouteContext(router);

  router.push(
    {
      pathname: `/deal-details/${deal.id}`,
      query: {
        // Backend has separate detail endpoints per deal type (voucher/original/cold) —
        // the type must travel with the link so the detail page knows which one to call.
        type: deal.dealType,
        ...(countryCode ? { countryCode } : {}),
        ...(lang ? { lang } : {}),
      },
    },
    undefined,
    {
      locale: lang,
    }
  );
};

/**
 * Get deal details URL
 * @param dealId - Deal ID
 * @param params - Optional language, country, and deal-type context
 * @returns URL string for deal details page
 */
export const getDealDetailsUrl = (
  dealId: string,
  params?: { lang?: string; countryCode?: string; dealType?: Deal["dealType"] }
) => {
  const query = new URLSearchParams();
  if (params?.dealType) {
    query.set("type", params.dealType);
  }
  if (params?.lang) {
    query.set("lang", params.lang);
  }
  if (params?.countryCode) {
    query.set("countryCode", params.countryCode);
  }

  const queryString = query.toString();
  return queryString
    ? `/deal-details/${dealId}?${queryString}`
    : `/deal-details/${dealId}`;
};

/**
 * Handle deal click with consistent logging and navigation
 * @param router - Next.js router instance
 * @param deal - Deal object
 * @param source - Source component name for analytics
 */
export const handleDealClick = (router: NextRouter, deal: Deal, source?: string) => {
  if (source) {
    console.log(`Deal clicked from ${source}:`, deal);
  } else {
    console.log('Deal clicked:', deal);
  }
  
  navigateToDealDetails(router, deal);
};