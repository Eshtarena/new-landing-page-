import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { DealCardProps } from "../../types/deals";

function SupplierLogo({
  logoUrl,
  supplierName,
}: {
  logoUrl?: string;
  supplierName?: string;
}) {
  const initials = (supplierName || "S").slice(0, 2).toUpperCase();

  return (
    <div className="relative w-10 h-10 shrink-0 -rotate-6">
      <div className="w-full h-full rounded-lg overflow-hidden bg-primary-500 shadow-sm flex items-center justify-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={supplierName || "Supplier"}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[9px] font-bold text-white leading-none text-center px-0.5">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

function LocationRow({ text }: { text: string }) {
  return (
    <div className="flex items-center text-[10px] text-primary-500">
      <svg
        className="w-3 h-3 me-1 shrink-0 text-primary-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="truncate">{text}</span>
    </div>
  );
}

export default function DealCard({
  deal,
  className = "",
  onCardClick,
}: Omit<DealCardProps, "showFullDetails">) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";

  const secondaryLine =
    deal.dealType === "voucher" ? deal.id : deal.description || deal.id;
  const tertiaryLine =
    deal.dealType === "voucher" ? deal.description : deal.productName;

  const countdownLabels = {
    days: t("dealDetails.timer.days", { defaultValue: isRTL ? "يوم" : "Day" }),
    hours: t("dealDetails.timer.hours", { defaultValue: isRTL ? "ساعة" : "Hrs" }),
    minutes: t("dealDetails.timer.minutes", { defaultValue: isRTL ? "دقيقة" : "Mins" }),
    seconds: t("dealDetails.timer.seconds", { defaultValue: isRTL ? "ثانية" : "Secs" }),
  };

  const pricingLabels = {
    voucherValue: t("deals.voucherValue", { defaultValue: "Voucher value" }),
    marketPrice: t("deals.marketPrice", { defaultValue: "Market price" }),
    dealPrice: t("deals.dealPrice", { defaultValue: "Deal Price" }),
    save: t("deals.save", { defaultValue: "Save" }),
  };

  const progressLabels = {
    progress: t("deals.progress", { defaultValue: "Progress" }),
    total: t("deals.total", { defaultValue: "Total" }),
    sold: t("dealDetails.sold", { defaultValue: isRTL ? "تم البيع" : "Sold" }),
    available: t("dealDetails.available", { defaultValue: isRTL ? "متاح" : "Available" }),
  };

  const endTimePrefix = t("dealDetails.endsAt", { defaultValue: isRTL ? "ينتهي في" : "Ends at" });

  return (
    <div
      className={`bg-white rounded-2xl shadow-soft border border-black/5 overflow-hidden transition-all duration-300 ease-spring hover:shadow-soft-lg cursor-pointer max-w-md mx-auto w-full ${className}`}
      onClick={() => onCardClick?.(deal)}
    >
      <div className="p-3 pb-0">
        <ImageCarousel
          images={deal.images}
          aspectRatio="video"
          autoScroll={deal.images.length > 1}
          autoScrollInterval={3000}
          showDots={deal.images.length > 1}
          showArrows={false}
          className="rounded-xl"
        />
      </div>

      <div className="p-3.5">
        {/* Mobile layout — matches native app */}
        <div className="md:hidden space-y-3">
          <div className="flex gap-2.5 items-start">
            <SupplierLogo logoUrl={deal.supplierLogo} supplierName={deal.supplier} />
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-bold tracking-tight truncate text-primary-500">
                {deal.title}
              </p>
              {deal.supplier && (
                <h2 className="text-base font-bold tracking-tight truncate text-primary-500 mt-0.5">
                  {deal.supplier}
                </h2>
              )}
              {(deal.productName || tertiaryLine) && (
                <p className="text-[11px] leading-tight truncate text-gray-400 mt-0.5">
                  {deal.productName || tertiaryLine}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col gap-1.5 min-w-0">
              <DealBadge
                dealType={deal.dealType}
                size="sm"
                isActive={deal.isActive}
              />
              <LocationRow text={deal.location.text} />
            </div>
            <CountdownTimer
              timer={deal.timer}
              textColor="text-blue-600"
              showEndTime
              endTimePrefix={endTimePrefix}
              locale={locale}
              labels={countdownLabels}
            />
          </div>

          <PricingDisplay deal={deal} locale={locale} labels={pricingLabels} />

          <ProgressBar
            quantity={deal.quantity}
            dealType={deal.dealType}
            showLabels
            height="xl"
            locale={locale}
            labels={progressLabels}
          />
        </div>

        {/* Desktop layout — unchanged */}
        <div className="hidden md:block space-y-3">
          <div className="flex gap-2.5 items-start">
            <SupplierLogo logoUrl={deal.supplierLogo} supplierName={deal.supplier} />
            <div className="flex-1 min-w-0 pt-0.5">
              <h2 className="text-sm font-bold tracking-tight truncate text-primary-500">
                {deal.title}
              </h2>
              <p className="text-xs font-semibold truncate text-primary-500 mt-0.5">
                {secondaryLine}
              </p>
              {tertiaryLine && (
                <p className="text-[11px] leading-tight truncate text-gray-400 mt-0.5">
                  {tertiaryLine}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col gap-1.5 min-w-0">
              <DealBadge
                dealType={deal.dealType}
                size="sm"
                isActive={deal.isActive}
              />
              <LocationRow text={deal.location.text} />
            </div>
            <CountdownTimer
              timer={deal.timer}
              textColor="text-blue-600"
            />
          </div>

          <PricingDisplay deal={deal} />

          <ProgressBar
            quantity={deal.quantity}
            dealType={deal.dealType}
            showLabels
            height="md"
          />
        </div>
      </div>
    </div>
  );
}
