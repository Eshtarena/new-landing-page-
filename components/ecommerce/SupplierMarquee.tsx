import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSuppliers } from '../../hooks/useSuppliers';

export default function SupplierMarquee() {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const { suppliers, isLoading, error } = useSuppliers();

  if (isLoading) {
    return <div className="py-4 sm:py-6 md:py-8 h-24 animate-pulse bg-gray-100" />;
  }

  if (error || suppliers.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 overflow-hidden w-full group">
      <div className="md:hidden flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold tracking-tight text-primary-500">
          {t('store.supplierSection')}
        </h2>
        <Link
          href="/store"
          className="text-sm font-semibold text-primary-500 hover:text-primary-500/80 transition-colors"
        >
          {t('store.seeAll')}
        </Link>
      </div>

      <div className="relative overflow-hidden text-left" dir="ltr">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-[marquee_55s_linear_infinite] gap-x-8 py-1 group-hover:[animation-play-state:paused]">
          {[...suppliers, ...suppliers].map((supplier, index) => (
            <Link
              key={`${supplier.id}-${index}`}
              href={supplier.link}
              className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 shrink-0 group/item w-20 sm:w-24 md:w-28"
            >
              <div className="relative w-16 h-16 overflow-hidden ring-2 ring-black/[0.06] shadow-soft bg-white transition-all duration-200 ease-spring group-hover/item:ring-primary-500 group-hover/item:shadow-[0_4px_16px_rgba(52,0,64,0.18)] group-hover/item:scale-105">
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
