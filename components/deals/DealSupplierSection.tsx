import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next/pages";
import { Deal } from "../../types/deals";

interface DealSupplierSectionProps {
  deal: Deal;
  className?: string;
}

export default function DealSupplierSection({ deal, className = "" }: DealSupplierSectionProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const tx = (key: string, en: string, ar: string) => t(key, { defaultValue: isRTL ? ar : en });

  if (!deal.supplier) return null;

  return (
    <section className={`rounded-2xl bg-white p-5 shadow-soft border border-black/5 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {tx("dealDetails.details.supplier", "Supplier", "المورد")}
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black/5 bg-white">
          {deal.supplierLogo ? (
            <Image src={deal.supplierLogo} alt={deal.supplier} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-500 font-bold">
              {deal.supplier.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 truncate">{deal.supplier}</p>
          <p className="text-xs text-gray-500">
            {tx("dealDetails.supplier.subtitle", "Deal supplier", "مورد العرض")}
          </p>
        </div>
        {deal.supplierId ? (
          <Link
            href={`/supplier-details/${deal.supplierId}`}
            className="shrink-0 inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-medium text-primary-500 bg-primary-50 border border-primary-500/10 rounded-full hover:bg-primary-100 transition-colors duration-200 ease-spring"
          >
            {tx("dealDetails.supplier.viewProfile", "View Profile", "عرض الملف")}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
