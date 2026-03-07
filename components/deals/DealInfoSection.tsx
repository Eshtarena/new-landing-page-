import React from "react";
import { Deal } from "../../types/deals";
import { COLORS } from "../../utils/colors";
import ImageCarousel from "./ImageCarousel";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import { DEAL_DETAILS_LABELS, type DealDetailsLang } from "../../utils/dealDetailsLabels";

interface DealInfoSectionProps {
  deal: Deal;
  lang?: DealDetailsLang;
  storeLinks?: { apple: string; google: string };
}

function getStoreUrl(storeLinks: { apple: string; google: string }): string {
  if (typeof window === "undefined") return storeLinks.google;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) ? storeLinks.apple : storeLinks.google;
}

export default function DealInfoSection({ deal, lang = "en", storeLinks }: DealInfoSectionProps) {
  const labels = DEAL_DETAILS_LABELS[lang];

  const pricingLabels = {
    voucherValue: labels.voucherValue,
    dealPrice: labels.dealPrice,
    save: labels.save,
    marketPrice: labels.marketPrice,
  };

  const defaultStoreLinks = {
    apple: "https://apps.apple.com/app/eshtarena",
    google: "https://play.google.com/store/apps/details?id=eshtarena.app",
  };
  const links = storeLinks || defaultStoreLinks;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 w-full">
      {/* Deal image(s): voucher = single, cold/original = may be multiple */}
      <div className="mb-4 md:mb-6">
        {deal.images.length > 0 ? (
          <ImageCarousel
            images={deal.images}
            autoScroll={deal.images.length > 1}
            autoScrollInterval={3000}
            showDots={deal.images.length > 1}
            showArrows={deal.images.length > 1}
            className="h-56 md:h-80 w-full rounded-lg overflow-hidden"
          />
        ) : (
          <div
            className="h-56 md:h-80 w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"
            aria-hidden
          >
            {lang === "ar" ? "لا توجد صورة" : "No image"}
          </div>
        )}
      </div>

      {/* Column 1: Deal name + Location | Column 2: Deal status + Deal type */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 ">
        <div className="flex flex-col gap-2 min-w-0">
          <h2
            className="text-xl md:text-2xl font-bold"
            style={{ color: COLORS.darkViolet }}
          >
            {deal.title}
          </h2>
          <div className="flex items-center" style={{ color: COLORS.darkViolet }}>
            <svg className="w-5 h-5 mr-1.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm md:text-base font-medium">{deal.location.text}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end shrink-0">
          {deal.isActive ? (
            <CountdownTimer
              timer={deal.timer}
              textColor="text-blue-600"
              className="text-base md:text-lg"
              labels={{
                days: labels.timerDays,
                hrs: labels.timerHrs,
                mins: labels.timerMins,
                secs: labels.timerSecs,
              }}
            />
          ) : (
            <span className="text-sm md:text-base font-semibold text-gray-600">
              {deal.statusLabel === "Ended" ? labels.statusEnded : labels.statusOnGoing}
            </span>
          )}
          <DealBadge dealType={deal.dealType} size="lg" isActive={deal.isActive} />
        </div>
      </div>

      {/* Pricing – voucher value, deal price, save */}
      <div className="mb-6">
        <PricingDisplay
          deal={deal}
          showSavings={true}
          layout="horizontal"
          className="bg-gray-50 rounded-lg p-4"
          labels={pricingLabels}
        />
      </div>

      {/* Progress: bar + Sold / Available */}
      <div className="mb-6">
        <ProgressBar
          quantity={deal.quantity}
          dealType={deal.dealType}
          showLabels={true}
          height="lg"
          soldLabel={labels.sold}
          availableLabel={labels.available}
        />
      </div>

      {/* Download the app – primary CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={getStoreUrl(links)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 px-6 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:opacity-95 text-center"
          style={{
            backgroundColor: COLORS.originalDeal,
            boxShadow: `0 4px 14px 0 ${COLORS.originalDeal}40`,
          }}
        >
          {labels.downloadTheApp}
        </a>
      </div>
    </div>
  );
}
