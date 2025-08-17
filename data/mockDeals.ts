import { Deal, VoucherDeal, ColdDeal, OriginalDeal } from '../types/deals';

// Mock deal data for demonstration purposes
// This file contains sample data to showcase the deal card components

// Fashion Category Deals
const fashionDeals: Deal[] = [
  {
    id: 'fashion-001',
    title: 'Designer Sneakers Collection',
    description: 'Premium quality sneakers from top brands with ultimate comfort',
    images: [
      {
        src: '/dummy_images/snekers.png',
        alt: 'Designer Sneakers'
      }
    ],
    dealType: 'cold',
    timer: {
      days: 2,
      hours: 15,
      minutes: 30,
      seconds: 45
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 127,
      available: 230
    },
    dealPrice: 450,
    saveAmount: 200,
    marketPrice: 650,
    currency: 'SAR',
    isActive: true,
    category: 'Fashion',
    priceChangeIndicator: 'down'
  } as ColdDeal,

  {
    id: 'fashion-002',
    title: 'Summer Fashion Collection',
    description: 'Trendy summer outfits for men and women',
    images: [
      {
        src: '/dummy_images/man_fashon.png',
        alt: 'Summer Fashion'
      }
    ],
    dealType: 'original',
    timer: {
      days: 1,
      hours: 8,
      minutes: 20,
      seconds: 15
    },
    location: {
      text: 'Riyadh & Jeddah'
    },
    quantity: {
      sold: 89,
      available: 156
    },
    dealPrice: 320,
    saveAmount: 80,
    marketPrice: 400,
    currency: 'SAR',
    isActive: true,
    category: 'Fashion'
  } as OriginalDeal
];

// Electronics Category Deals
const electronicsDeals: Deal[] = [
  {
    id: 'electronics-001',
    title: 'MacBook Pro M3',
    description: 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
    images: [
      {
        src: '/dummy_images/laptop.png',
        alt: 'MacBook Pro M3'
      },
      {
        src: '/dummy_images/laptop2.png',
        alt: 'MacBook Pro M3'
      },
    ],
    dealType: 'cold',
    timer: {
      days: 0,
      hours: 23,
      minutes: 45,
      seconds: 12
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 45,
      available: 80
    },
    dealPrice: 8500,
    saveAmount: 1500,
    marketPrice: 10000,
    currency: 'SAR',
    isActive: true,
    category: 'Electronics',
    priceChangeIndicator: 'down'
  } as ColdDeal,

  {
    id: 'electronics-002',
    title: 'Samsung 65" QLED TV',
    description: '4K QLED Smart TV with HDR and Tizen OS',
    images: [
      {
        src: '/landing_page/english/original_deal.png',
        alt: 'Samsung QLED TV'
      }
    ],
    dealType: 'original',
    timer: {
      days: 3,
      hours: 12,
      minutes: 0,
      seconds: 30
    },
    location: {
      text: 'Major Cities'
    },
    quantity: {
      sold: 67,
      available: 120
    },
    dealPrice: 3200,
    saveAmount: 800,
    marketPrice: 4000,
    currency: 'SAR',
    isActive: true
  } as OriginalDeal
];

// Home & Kitchen Category Deals
const homeKitchenDeals: Deal[] = [
  {
    id: 'home-001',
    title: 'Kitchen Appliances Voucher',
    description: 'Voucher valid for all kitchen appliances and cookware',
    images: [
      {
        src: '/dummy_images/home_kitchen.png',
        alt: 'Kitchen Appliances Voucher'
      }
    ],
    dealType: 'voucher',
    timer: {
      days: 7,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 234,
      available: 500
    },
    dealPrice: 750,
    saveAmount: 250,
    voucherValue: 1000,
    currency: 'SAR',
    isActive: true
  } as VoucherDeal,

  {
    id: 'home-002',
    title: 'Smart Home Bundle',
    description: 'Complete smart home setup with sensors and controllers',
    images: [
      {
        src: '/landing_page/english/cold_deal.png',
        alt: 'Smart Home Bundle'
      }
    ],
    dealType: 'cold',
    timer: {
      days: 1,
      hours: 18,
      minutes: 35,
      seconds: 22
    },
    location: {
      text: 'Riyadh Only'
    },
    quantity: {
      sold: 78,
      available: 150
    },
    dealPrice: 1200,
    saveAmount: 400,
    marketPrice: 1600,
    currency: 'SAR',
    isActive: true,
    priceChangeIndicator: 'down'
  } as ColdDeal
];

// Health & Beauty Category Deals
const beautyDeals: Deal[] = [
  {
    id: 'beauty-001',
    title: 'Skincare Premium Set',
    description: 'Complete skincare routine with organic ingredients',
    images: [
      {
        src: '/landing_page/english/original_deal.png',
        alt: 'Skincare Set'
      }
    ],
    dealType: 'original',
    timer: {
      days: 0,
      hours: 6,
      minutes: 45,
      seconds: 33
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 156,
      available: 200
    },
    dealPrice: 280,
    saveAmount: 120,
    marketPrice: 400,
    currency: 'SAR',
    isActive: true
  } as OriginalDeal,

  {
    id: 'beauty-002',
    title: 'Spa Treatment Voucher',
    description: 'Luxury spa treatment voucher for premium wellness centers',
    images: [
      {
        src: '/landing_page/english/voucher_deal2.png',
        alt: 'Spa Voucher'
      }
    ],
    dealType: 'voucher',
    timer: {
      days: 30,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    location: {
      text: 'Riyadh & Jeddah'
    },
    quantity: {
      sold: 89,
      available: 300
    },
    dealPrice: 450,
    saveAmount: 150,
    voucherValue: 600,
    currency: 'SAR',
    isActive: true
  } as VoucherDeal
];

// Sports & Outdoors Category Deals
const sportsDeals: Deal[] = [
  {
    id: 'sports-001',
    title: 'Professional Gym Equipment',
    description: 'Complete home gym setup with weights and machines',
    images: [
      {
        src: '/landing_page/english/cold_deal.png',
        alt: 'Gym Equipment'
      }
    ],
    dealType: 'cold',
    timer: {
      days: 5,
      hours: 14,
      minutes: 20,
      seconds: 10
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 34,
      available: 75
    },
    dealPrice: 2800,
    saveAmount: 700,
    marketPrice: 3500,
    currency: 'SAR',
    isActive: true,
    priceChangeIndicator: 'down'
  } as ColdDeal,

  {
    id: 'sports-002',
    title: 'Outdoor Adventure Gear',
    description: 'Complete camping and hiking equipment package',
    images: [
      {
        src: '/landing_page/english/original_deal.png',
        alt: 'Adventure Gear'
      }
    ],
    dealType: 'original',
    timer: {
      days: 4,
      hours: 22,
      minutes: 15,
      seconds: 55
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 67,
      available: 125
    },
    dealPrice: 950,
    saveAmount: 250,
    marketPrice: 1200,
    currency: 'SAR',
    isActive: true
  } as OriginalDeal
];

// Automotive Category Deals
const automotiveDeals: Deal[] = [
  {
    id: 'auto-001',
    title: 'Car Maintenance Voucher',
    description: 'Comprehensive car service voucher for all major brands',
    images: [
      {
        src: '/landing_page/english/voucher_deal.png',
        alt: 'Car Service Voucher'
      }
    ],
    dealType: 'voucher',
    timer: {
      days: 14,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    location: {
      text: 'All KSA'
    },
    quantity: {
      sold: 145,
      available: 400
    },
    dealPrice: 380,
    saveAmount: 120,
    voucherValue: 500,
    currency: 'SAR',
    isActive: true
  } as VoucherDeal
];

// Grocery Category Deals
const groceryDeals: Deal[] = [
  {
    id: 'grocery-001',
    title: 'Organic Food Bundle',
    description: 'Fresh organic vegetables, fruits, and dairy products',
    images: [
      {
        src: '/landing_page/english/original_deal.png',
        alt: 'Organic Food'
      }
    ],
    dealType: 'original',
    timer: {
      days: 0,
      hours: 12,
      minutes: 30,
      seconds: 0
    },
    location: {
      text: 'Major Cities'
    },
    quantity: {
      sold: 189,
      available: 250
    },
    dealPrice: 180,
    saveAmount: 50,
    marketPrice: 230,
    currency: 'SAR',
    isActive: true
  } as OriginalDeal
];

// All Mock Deals Combined
export const ALL_MOCK_DEALS: Deal[] = [
  ...fashionDeals,
  ...electronicsDeals,
  ...homeKitchenDeals,
  ...beautyDeals,
  ...sportsDeals,
  ...automotiveDeals,
  ...groceryDeals
];

// Organized by Categories for Mega Deals Section
export const MOCK_MEGA_DEALS_BY_CATEGORY = {
  fashion: {
    title: 'Fashion Deals',
    deals: fashionDeals
  },
  electronics: {
    title: 'Electronics Deals',
    deals: electronicsDeals
  },
  home: {
    title: 'Home & Kitchen Deals',
    deals: homeKitchenDeals
  },
  beauty: {
    title: 'Health & Beauty Deals',
    deals: beautyDeals
  },
  sports: {
    title: 'Sports & Outdoors Deals',
    deals: sportsDeals
  },
  automotive: {
    title: 'Automotive Deals',
    deals: automotiveDeals
  },
  grocery: {
    title: 'Grocery Deals',
    deals: groceryDeals
  }
};

// Utility Functions for Mock Data
export const getMockVoucherDeals = (): VoucherDeal[] => {
  return ALL_MOCK_DEALS.filter(deal => deal.dealType === 'voucher') as VoucherDeal[];
};

export const getMockColdDeals = (): ColdDeal[] => {
  return ALL_MOCK_DEALS.filter(deal => deal.dealType === 'cold') as ColdDeal[];
};

export const getMockOriginalDeals = (): OriginalDeal[] => {
  return ALL_MOCK_DEALS.filter(deal => deal.dealType === 'original') as OriginalDeal[];
};

export const getMockActiveDeals = (): Deal[] => {
  return ALL_MOCK_DEALS.filter(deal => deal.isActive);
};

export const getMockDealsByLocation = (location: string): Deal[] => {
  return ALL_MOCK_DEALS.filter(deal => 
    deal.location.text.toLowerCase().includes(location.toLowerCase()) || 
    deal.location.text.toLowerCase().includes('all ksa')
  );
};

export const getMockFeaturedDeals = (): Deal[] => {
  return ALL_MOCK_DEALS
    .filter(deal => deal.isActive)
    .sort((a, b) => {
      const timeA = a.timer.days * 24 * 60 + a.timer.hours * 60 + a.timer.minutes;
      const timeB = b.timer.days * 24 * 60 + b.timer.hours * 60 + b.timer.minutes;
      return timeA - timeB;
    })
    .slice(0, 6);
}; 