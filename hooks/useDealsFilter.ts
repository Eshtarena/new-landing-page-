import { useState, useMemo } from 'react';
import { Deal, DealType } from '../types/deals';
import { FilterState } from '../components/ecommerce/FilterComponent';

export function useDealsFilter(deals: Deal[]) {
  const [filters, setFilters] = useState<FilterState>({
    dealType: 'all',
    priceRange: { min: 0, max: 10000 },
    categories: [],
    locations: []
  });

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Filter by deal type
      if (filters.dealType !== 'all' && deal.dealType !== filters.dealType) {
        return false;
      }

      // Filter by price range
      if (deal.dealPrice < filters.priceRange.min || deal.dealPrice > filters.priceRange.max) {
        return false;
      }

      // Filter by categories (if categories are selected)
      if (filters.categories.length > 0) {
        const dealCategory = deal.category || getDealCategoryFromData(deal);
        if (!dealCategory || !filters.categories.includes(dealCategory)) {
          return false;
        }
      }

      // Filter by locations (if locations are selected)
      if (filters.locations.length > 0) {
        const dealLocation = deal.location.text;
        const matchesLocation = filters.locations.some(selectedLocation => {
          // Check for exact match or "All KSA" includes everything
          return dealLocation.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                 (selectedLocation === 'All KSA' && dealLocation.includes('KSA')) ||
                 dealLocation === 'All KSA';
        });
        if (!matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [deals, filters]);

  return {
    filters,
    setFilters,
    filteredDeals,
    totalDeals: deals.length,
    filteredCount: filteredDeals.length
  };
}

// Helper function to determine category from deal data
function getDealCategoryFromData(deal: Deal): string | null {
  const title = deal.title.toLowerCase();
  const description = deal.description?.toLowerCase() || '';
  
  if (title.includes('sneaker') || title.includes('fashion') || title.includes('clothing')) {
    return 'Fashion';
  }
  if (title.includes('macbook') || title.includes('tv') || title.includes('electronics')) {
    return 'Electronics';
  }
  if (title.includes('kitchen') || title.includes('home') || title.includes('smart home')) {
    return 'Home & Kitchen';
  }
  if (title.includes('skincare') || title.includes('spa') || title.includes('beauty')) {
    return 'Health & Beauty';
  }
  if (title.includes('gym') || title.includes('sports') || title.includes('adventure')) {
    return 'Sports & Outdoors';
  }
  if (title.includes('car') || title.includes('automotive') || title.includes('maintenance')) {
    return 'Automotive';
  }
  if (title.includes('organic') || title.includes('food') || title.includes('grocery')) {
    return 'Grocery';
  }
  
  return null;
}
