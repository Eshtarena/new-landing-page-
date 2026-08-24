import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { DealCardProps } from "../../types/deals";

const MOBILE_TEXT_PRIMARY = "#340040";
const MOBILE_TIMER_BLUE = "#2B64E3";

function SupplierLogo({
  logoUrl,
  supplierName,
  className = "",
}: {
  logoUrl?: string;
  supplierName?: string;
  className?: string;
}) {
  const initials = (supplierName || "S").slice(0, 2).toUpperCase();

  return (
    <div className={`relative w-10 h-10 shrink-0 ${className}`}>
      <div className="w-full h-full rounded-[16px] overflow-hidden bg-primary-500 flex items-center justify-center">
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

function LocationRow({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 text-[10px] text-[#808080] ${className}`}>
      <svg
        className="w-3 h-3 shrink-0 text-[#808080]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span className="truncate font-normal">{text}</span>
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

  const carouselProps = {
    images: deal.images,
    autoScroll: deal.images.length > 1,
    autoScrollInterval: 3000,
    showArrows: false as const,
  };

  return (
    <div
      className={`bg-white overflow-hidden transition-all duration-300 ease-spring cursor-pointer max-w-md mx-auto w-full rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:rounded-2xl md:shadow-soft md:border md:border-black/5 hover:shadow-soft-lg ${className}`}
      onClick={() => onCardClick?.(deal)}
    >
      {/* Mobile image */}
      <div className="px-4 pt-4 pb-0 md:hidden">
        <ImageCarousel
          {...carouselProps}
          aspectRatio="dealMobile"
          showDots={false}
          showCounter={false}
          className="rounded-2xl"
        />
      </div>

      {/* Desktop image */}
      <div className="hidden md:block p-3 pb-0">
        <ImageCarousel
          {...carouselProps}
          aspectRatio="video"
          showDots={deal.images.length > 1}
          showCounter
          className="rounded-xl"
        />
      </div>

      <div className="p-4 md:p-3.5">
        {/* Mobile layout — matches native app */}
        <div className="md:hidden space-y-3.5">
          <div className="flex gap-3 items-start">
            <SupplierLogo logoUrl={deal.supplierLogo} supplierName={deal.supplier} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-normal leading-snug truncate"
                style={{ color: MOBILE_TEXT_PRIMARY }}
              >
                {deal.title}
              </p>
              {deal.supplier && (
                <h2
                  className="text-lg font-bold leading-tight truncate mt-0.5"
                  style={{ color: MOBILE_TEXT_PRIMARY }}
                >
                  {deal.supplier}
                </h2>
              )}
              {(deal.productName || tertiaryLine) && (
                <p className="text-xs font-normal leading-tight truncate text-[#808080] mt-0.5">
                  {deal.productName || tertiaryLine}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
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
              textColor="text-[#2B64E3]"
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
            className="[&>div:first-child>span:first-child]:font-normal [&>div:first-child>span:first-child]:text-[#808080] [&>div:last-child]:text-[#808080] [&>div:last-child]:font-normal"
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block space-y-3">
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
              textColor="text-[#4361EE]"
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
      </div>
    </div>
  );
}
