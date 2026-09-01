import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { Deal, DEAL_THEMES } from "../../types/deals";
import DealBadge from "./DealBadge";
import PricingDisplay from "./PricingDisplay";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";
import { useJoinDeal } from "../../hooks/useJoinDeal";
import DownloadAppModal from "./DownloadAppModal";
import ComingSoonModal from "../ComingSoonModal";
import { resolvePageLang } from "../../utils/resolvePageLang";

interface DealInfoSectionProps {
  deal: Deal;
  className?: string;
  storeLinks?: {
    apple: string;
    google: string;
  };
}

export default function DealInfoSection({
  deal,
  className = "",
  storeLinks,
}: DealInfoSectionProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const resolvedLang = resolvePageLang(router, i18n.language);
  const isRTL = resolvedLang === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";
  const tx = (key: string, en: string, ar: string) =>
    t(key, { defaultValue: isRTL ? ar : en });

  const { handleJoinDeal, showDesktopModal, closeDesktopModal, showComingSoon, closeComingSoon } = useJoinDeal();
  const theme = DEAL_THEMES[deal.dealType];
  const totalQuantity = deal.quantity.sold + deal.quantity.available;

  const defaultStoreLinks = {
    apple: "https://apps.apple.com/app/eshtarena",
    google: "https://play.google.com/store/apps/details?id=eshtarena.app",
  };
  const links = storeLinks || defaultStoreLinks;

  return (
    <>
      <aside
        className={`flex flex-col gap-5 lg:sticky lg:top-24 ${className}`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DealBadge dealType={deal.dealType} size="lg" isActive={deal.isActive} />
            {deal.productName ? (
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 border border-black/5 shadow-soft">
                {deal.productName}
              </span>
            ) : null}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            {deal.title}
          </h1>

          {deal.supplier ? (
            <div className="flex items-center gap-3">
              {deal.supplierLogo ? (
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-black/5 bg-white">
                  <Image
                    src={deal.supplierLogo}
                    alt={deal.supplier}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="text-xs text-gray-500">
                  {tx("dealDetails.details.supplier", "Supplier", "المورد")}
                </p>
                <p className="text-sm font-semibold text-gray-800">{deal.supplier}</p>
              </div>
            </div>
          ) : null}
        </div>

        <PricingDisplay
          deal={deal}
          showSavings={true}
          layout="horizontal"
          className="bg-white shadow-soft border-black/5"
          locale={locale}
          labels={{
            voucherValue: t("deals.voucherValue"),
            marketPrice: t("deals.marketPrice"),
            dealPrice: t("deals.dealPrice"),
            save: t("deals.save"),
          }}
        />

        <div className="rounded-2xl bg-white p-5 shadow-soft border border-black/5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-600">
              {tx("dealDetails.endsIn", "Deal ends in", "ينتهي العرض خلال")}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 min-w-0">
              <svg className="h-4 w-4 shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate font-medium">{deal.location.text}</span>
            </div>
          </div>

          <CountdownTimer
            timer={deal.timer}
            textColor="text-[#2B64E3]"
            className="min-w-max"
            locale={locale}
            labels={{
              days: tx("dealDetails.timer.days", "Days", "يوم"),
              hours: tx("dealDetails.timer.hours", "Hrs", "ساعة"),
              minutes: tx("dealDetails.timer.minutes", "Mins", "دقيقة"),
              seconds: tx("dealDetails.timer.seconds", "Secs", "ثانية"),
            }}
          />

          <ProgressBar
            quantity={deal.quantity}
            dealType={deal.dealType}
            showLabels={true}
            height="lg"
            locale={locale}
            labels={{
              sold: tx("dealDetails.sold", "Sold", "تم البيع"),
              available: tx("dealDetails.available", "Available", "المتاح"),
            }}
          />

          <p className="text-xs text-gray-500 text-center">
            {deal.quantity.sold.toLocaleString(locale)} / {totalQuantity.toLocaleString(locale)}{" "}
            {tx("dealDetails.stats.sold", "sold", "تم البيع")}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft border border-black/5 space-y-3">
          <button
            type="button"
            onClick={handleJoinDeal}
            className="w-full min-h-12 py-3.5 px-6 text-white font-semibold text-lg rounded-full transition-all duration-200 ease-spring hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 8px 24px 0 ${theme.primary}40`,
            }}
          >
            {tx("dealDetails.joinDeal", "Join Deal", "انضم للعرض")}
          </button>
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {tx(
              "dealDetails.supportText",
              "Download the app to join this deal and complete your purchase securely.",
              "حمّل التطبيق للانضمام لهذا العرض وإتمام عملية الشراء بأمان."
            )}
          </p>
        </div>
      </aside>

      <DownloadAppModal isOpen={showDesktopModal} onClose={closeDesktopModal} />
      <ComingSoonModal isOpen={showComingSoon} onClose={closeComingSoon} />
    </>
  );
}
