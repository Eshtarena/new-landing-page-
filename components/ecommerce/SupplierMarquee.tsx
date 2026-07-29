import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSuppliers } from '../../hooks/useSuppliers';
import ScrollingLabel from './ScrollingLabel';

export default function SupplierMarquee() {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const { suppliers, isLoading, error } = useSuppliers();

  if (isLoading) {
    return <div className="py-2 md:py-2 h-24 animate-pulse bg-gray-100" />;
  }

  if (error || suppliers.length === 0) {
    return null;
  }

  return (
    <section className="pt-2 pb-0 md:pt-1 md:pb-2 lg:pt-2 lg:pb-2 overflow-hidden w-full group">
      <div className="md:hidden flex items-baseline justify-between mb-2 gap-3">
        <h2 className="text-lg font-bold tracking-tight text-primary-500">
          {t('store.supplierSection')}
        </h2>
        <Link
          href="/suppliers"
          className="text-sm font-normal text-primary-500 hover:text-primary-500/80 transition-colors shrink-0"
        >
          {t('store.seeAll')}
        </Link>
      </div>

      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <div className="flex gap-x-5 w-max">
          {suppliers.map((supplier) => (
            <Link
              key={supplier.id}
              href={supplier.link}
              className="flex flex-col items-center gap-y-1.5 shrink-0 w-[72px]"
            >
              <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden bg-white">
                <Image
                  src={supplier.logoUrl}
                  alt={isRTL ? supplier.name_ar : supplier.name_en}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <ScrollingLabel
                text={isRTL ? supplier.name_ar : supplier.name_en}
                className="text-xs font-normal leading-tight text-primary-500"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden md:block relative overflow-hidden text-left" dir="ltr">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[marquee_55s_linear_infinite] gap-x-8 py-1 group-hover:[animation-play-state:paused]">
          {[...suppliers, ...suppliers].map((supplier, index) => (
            <Link
              key={`${supplier.id}-${index}`}
              href={supplier.link}
              className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 shrink-0 group/item w-20 sm:w-24 md:w-28"
            >
              <div className="relative w-16 h-16 overflow-hidden transition-all duration-200 ease-spring group-hover/item:scale-105">
                <Image
                  src={supplier.logoUrl}
                  alt={isRTL ? supplier.name_ar : supplier.name_en}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center leading-tight text-gray-600 group-hover/item:text-primary-500 transition-colors duration-200 line-clamp-2">
                {isRTL ? supplier.name_ar : supplier.name_en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
