import React from 'react';
import Image from 'next/image';

interface PromoStat {
  value: string;
  label: string;
}

export default function PromoBanner() {
  const promoStats: PromoStat[] = [
    {
      value: '0%',
      label: 'INTEREST'
    },
    {
      value: '0%',
      label: 'PURCHASE FEES'
    },
    {
      value: '0%',
      label: 'DOWN PAYMENT'
    }
  ];

  return (
    <div className="bg-primary-500 text-white py-4 px-6 rounded-lg my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">BUY NOW, PAY LATER</div>
          <div className="bg-white text-primary-500 px-3 py-1 rounded-full text-sm font-semibold">
            up to 3 months
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          {promoStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-xs uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-xs">
          *T&Cs apply
        </div>
      </div>
    </div>
  );
} 