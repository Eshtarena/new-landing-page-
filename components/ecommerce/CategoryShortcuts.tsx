import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/useCategories';

interface Shortcut {
  id: string | number;
  title: string;
  image: string;
  link: string;
}

// Used only while categories are loading or if /v1/user/categories is unreachable.
const FALLBACK_SHORTCUTS: Shortcut[] = [
  { id: 1, title: 'Donate For Gaza', image: '/dummy_images/palastine.png', link: '/donate' },
  { id: 5, title: "Men's Fashion", image: '/dummy_images/man_fashon.png', link: '/mens-fashion' },
  { id: 9, title: 'Mobiles', image: '/dummy_images/mobile1.png', link: '/mobiles' },
  { id: 6, title: "Women's Fashion", image: '/dummy_images/woman_fashon.png', link: '/womens-fashion' },
  { id: 7, title: "Kids' Fashion", image: '/dummy_images/kids_fashon.png', link: '/kids-fashion' },
  { id: 2, title: 'Summer Store', image: '/dummy_images/summer.png', link: '/summer' },
  { id: 3, title: 'Installments & Discounts', image: '/dummy_images/installments.png', link: '/installments' },
  { id: 4, title: 'Bestsellers', image: '/dummy_images/bestsellers.png', link: '/bestsellers' },
  { id: 8, title: 'Home & Kitchen', image: '/dummy_images/home_kitchen.png', link: '/home-kitchen' },
  { id: 10, title: 'Beauty', image: '/dummy_images/beauty.png', link: '/beauty' }
];

export default function CategoryShortcuts() {
  const { i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const { categories, isLoading, error } = useCategories();

  const useFallback = !isLoading && (error !== null || categories.length === 0);
  const shortcuts: Shortcut[] = useFallback
    ? FALLBACK_SHORTCUTS
    : categories.map((category) => ({
        id: category.id,
        title: isRTL ? category.name_ar : category.name_en,
        image: category.iconUrl,
        link: category.link
      }));

  if (isLoading) {
    return <div className="py-4 sm:py-6 md:py-8 h-24 animate-pulse bg-gray-100" />;
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 overflow-hidden w-full group">
      {/* dir="ltr" isolates the track from page-level RTL text-align so the loop stays in view */}
      <div className="relative overflow-hidden text-left" dir="ltr">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[marquee_20s_linear_infinite] gap-x-8 group-hover:[animation-play-state:paused]">
          {[...shortcuts, ...shortcuts].map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={category.link}
              className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 shrink-0 group/item w-20 sm:w-24 md:w-28"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/5 shadow-soft group-hover/item:ring-2 group-hover/item:ring-primary-500 transition-all duration-200 ease-spring">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center leading-tight text-gray-600 group-hover/item:text-primary-500 transition-colors duration-200 line-clamp-2">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
