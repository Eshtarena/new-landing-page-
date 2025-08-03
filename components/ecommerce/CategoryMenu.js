import { useState } from 'react';

export default function CategoryMenu() {
  const categories = [
    'Electronics',
    'Women\'s Fashion',
    'Men\'s Fashion',
    'Kids\' Fashion',
    'Beauty & Fragrance',
    'Home & Appliances',
    'Baby',
    'Toys & Games',
    'Supermarket',
    'Automotive',
    'Toys & Games',
    'Supermarket',
    'Automotive',
    'Toys & Games',
    'Supermarket',
    'Automotive',
    'Toys & Games',
    'Supermarket',
    'Automotive',
    'Toys & Games',
    'Supermarket',
    'Automotive',
    'Toys & Games',
    'Supermarket',
    'Automotive'
  ];

  return (
    <div className="bg-[#340040] border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="flex space-x-8 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={index}
                className="text-white hover:text-white whitespace-nowrap text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Gradient fade for scroll indication */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l pointer-events-none" />
        </div>
      </div>
    </div>
  );
} 