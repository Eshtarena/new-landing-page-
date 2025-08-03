import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function CategoryShortcuts() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const shortcuts = [
    {
      id: 1,
      title: 'Donate For Gaza',
      image: '/landing_page/english/cold_deal.png',
      link: '/donate'
    },
    {
      id: 2,
      title: 'Summer Store',
      image: '/landing_page/english/original_deal.png',
      link: '/summer'
    },
    {
      id: 3,
      title: 'Installments & Discounts',
      image: '/landing_page/english/voucher_deal.png',
      link: '/installments'
    },
    {
      id: 4,
      title: 'Bestsellers',
      image: '/landing_page/english/voucher_deal2.png',
      link: '/bestsellers'
    },
    {
      id: 5,
      title: 'Men\'s Fashion',
      image: '/landing_page/english/your_needs_easily.png',
      link: '/mens-fashion'
    },
    {
      id: 6,
      title: 'Women\'s Fashion',
      image: '/landing_page/english/cold_deal.png',
      link: '/womens-fashion'
    },
    {
      id: 7,
      title: 'Kids\' Fashion',
      image: '/landing_page/english/original_deal.png',
      link: '/kids-fashion'
    },
    {
      id: 8,
      title: 'Home & Kitchen',
      image: '/landing_page/english/voucher_deal.png',
      link: '/home-kitchen'
    },
    {
      id: 9,
      title: 'Mobiles',
      image: '/landing_page/english/voucher_deal2.png',
      link: '/mobiles'
    },
    {
      id: 10,
      title: 'Beauty',
      image: '/landing_page/english/your_needs_easily.png',
      link: '/beauty'
    }
  ];

  return (
    <div className="py-8 relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4"
      >
        <svg className="w-6 h-6 text-[#340040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 px-4 scrollbar-hide scroll-smooth"
        style={{
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',   /* Firefox */
        }}
      >
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.id}
            href={shortcut.link}
            className="flex flex-col items-center group flex-shrink-0"
            style={{ minWidth: '120px' }}
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 group-hover:ring-2 ring-[#340040]">
              <Image
                src={shortcut.image}
                alt={shortcut.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <span className="text-l text-center text-gray-600 group-hover:text-[#340040]">
              {shortcut.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -mr-4"
      >
        <svg className="w-6 h-6 text-[#340040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Add these styles to your global CSS or a style tag */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 