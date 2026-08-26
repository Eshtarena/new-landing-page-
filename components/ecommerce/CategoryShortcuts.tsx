import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/useCategories';
import { useDesktopMarqueeOverflow } from '../../hooks/useDesktopMarqueeOverflow';
import ScrollingLabel from './ScrollingLabel';

interface Shortcut {
  id: string | number;
  title: string;
  image: string;
  link: string;
}

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
  const { t, i18n } = useTranslation('common');
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
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const desktopMeasureRef = useRef<HTMLDivElement>(null);
  const shouldMarquee = useDesktopMarqueeOverflow(
    desktopContainerRef,
    desktopMeasureRef,
    shortcuts.length
  );

  if (isLoading) {
    return <div className="py-2 md:py-2 h-24 animate-pulse bg-gray-100" />;
  }

  return (
    <section className="pt-2 pb-0 md:pt-1 md:pb-2 lg:pt-2 lg:pb-2 overflow-hidden w-full group">
      <div className="md:hidden flex items-baseline justify-between mb-2 gap-3">
        <h2 className="text-lg font-bold tracking-tight text-primary-500">
          {t('store.categoriesSection')}
        </h2>
        <Link
          href="/categories"
          className="text-sm font-normal text-primary-500 hover:text-primary-500/80 transition-colors shrink-0"
        >
          {t('store.seeMore')}
        </Link>
      </div>

      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <div className="flex gap-x-5 w-max">
          {shortcuts.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="flex flex-col items-center gap-y-1.5 shrink-0 w-[72px]"
            >
              <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <ScrollingLabel
                text={category.title}
                className="text-xs font-normal leading-tight text-primary-500"
              />
            </Link>
          ))}
        </div>
      </div>

      <div
        ref={desktopContainerRef}
        className="hidden md:block relative overflow-hidden text-left"
        dir="ltr"
      >
        <div
          ref={desktopMeasureRef}
          className="flex w-max gap-x-8 invisible absolute pointer-events-none"
          aria-hidden
        >
          {shortcuts.map((category) => (
            <Link
              key={`measure-${category.id}`}
              href={category.link}
              tabIndex={-1}
              className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 shrink-0 group/item w-20 sm:w-24 md:w-28"
            >
              <div className="relative w-16 h-16 rounded-none overflow-hidden">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center leading-tight text-gray-600 line-clamp-2">
                {category.title}
              </span>
            </Link>
          ))}
        </div>

        {shouldMarquee && (
          <>
            <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
          </>
        )}

        <div
          className={`flex gap-x-8 py-1 ${
            shouldMarquee
              ? 'w-max animate-[marquee_55s_linear_infinite_reverse] group-hover:[animation-play-state:paused]'
              : 'justify-center'
          }`}
        >
          {(shouldMarquee ? [...shortcuts, ...shortcuts] : shortcuts).map(
            (category, index) => (
              <Link
                key={`${category.id}-${index}`}
                href={category.link}
                className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 shrink-0 group/item w-20 sm:w-24 md:w-28"
              >
                <div className="relative w-16 h-16 rounded-none overflow-hidden transition-all duration-200 ease-spring group-hover/item:scale-105">
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
            )
          )}
        </div>
      </div>
    </section>
  );
}
