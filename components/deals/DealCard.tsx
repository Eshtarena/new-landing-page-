import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import ImageCarousel from "./ImageCarousel";
import CountdownTimer, { getDealEndTimeLabel } from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import { Deal, DealCardProps } from "../../types/deals";

const TEXT_PRIMARY = "#340040";

function SupplierLogo({
  logoUrl,
  supplierName,
}: {
  logoUrl?: string;
  supplierName?: string;
}) {
  const initials = (supplierName || "S").slice(0, 2).toUpperCase();

  return (
    <div className="relative h-12 w-12 shrink-0">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1a1a2e]">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={supplierName || "Supplier"}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-0.5 text-center text-[10px] font-bold leading-none text-white">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

function LocationRow({ text }: { text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[11px] leading-none text-[#808080]">
      <svg
        className="h-3 w-3 shrink-0 text-[#808080]"
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

function DealCardBody({
  deal,
  locale,
  showEndTime,
  countdownLabels,
  pricingLabels,
  progressLabels,
  endTimePrefix,
}: {
  deal: Deal;
  locale: string;
  showEndTime: boolean;
  countdownLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  pricingLabels: {
    voucherValue: string;
    marketPrice: string;
    dealPrice: string;
    save: string;
  };
  progressLabels: {
    progress: string;
    total: string;
    sold: string;
    available: string;
  };
  endTimePrefix: string;
}) {
  const subtitle = deal.productName ?? "";

  return (
    <div className="space-y-3.5">
      <DealBadge dealType={deal.dealType} size="sm" isActive={deal.isActive} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {deal.supplier ? (
            <p className="truncate text-[13px] font-normal leading-snug text-[#808080]">
              {deal.supplier}
            </p>
          ) : (
            <p className="h-[18px]" aria-hidden="true" />
          )}
          <h2
            className="mt-0.5 truncate text-lg font-bold leading-tight"
            style={{ color: TEXT_PRIMARY }}
          >
            {deal.title}
          </h2>
          <p
            className="mt-0.5 h-4 truncate text-xs font-normal leading-tight text-[#808080]"
            aria-hidden={!subtitle}
          >
            {subtitle || "\u00A0"}
          </p>
        </div>
        <SupplierLogo logoUrl={deal.supplierLogo} supplierName={deal.supplier} />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <LocationRow text={deal.location.text} />
          <CountdownTimer
            timer={deal.timer}
            textColor="text-[#2B64E3]"
            showEndTime={false}
            locale={locale}
            labels={countdownLabels}
          />
        </div>
        {showEndTime ? (
          <div className="mt-1.5 flex justify-end">
            <span className="whitespace-nowrap text-[10px] font-normal text-gray-500">
              {getDealEndTimeLabel(deal.timer, locale, endTimePrefix)}
            </span>
          </div>
        ) : null}
      </div>

      <PricingDisplay deal={deal} locale={locale} labels={pricingLabels} />

      <ProgressBar
        quantity={deal.quantity}
        dealType={deal.dealType}
        showLabels
        showThumb
        height="xl"
        locale={locale}
        labels={progressLabels}
      />
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

  const countdownLabels = {
    days: t("dealDetails.timer.days", { defaultValue: isRTL ? "Day" : "Day" }),
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

  const bodyProps = {
    deal,
    locale,
    countdownLabels,
    pricingLabels,
    progressLabels,
    endTimePrefix,
  };

  return (
    <div
      className={`mx-auto w-full max-w-md cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ease-spring hover:shadow-soft-lg md:rounded-2xl md:border md:border-black/5 md:shadow-soft ${className}`}
      onClick={() => onCardClick?.(deal)}
    >
      <div className="px-4 pt-4 pb-0 md:hidden">
        <ImageCarousel
          {...carouselProps}
          aspectRatio="dealMobile"
          showDots
          showCounter={false}
          className="rounded-2xl"
        />
      </div>

      <div className="hidden p-3 pb-0 md:block">
        <ImageCarousel
          {...carouselProps}
          aspectRatio="video"
          showDots
          showCounter
          className="rounded-xl"
        />
      </div>

      <div className="p-4 md:p-3.5">
        <div className="md:hidden">
          <DealCardBody {...bodyProps} showEndTime={false} />
        </div>
        <div className="hidden md:block">
          <DealCardBody {...bodyProps} showEndTime />
        </div>
      </div>
    </div>
  );
}
