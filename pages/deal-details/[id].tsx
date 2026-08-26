import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import DealInfoSection from "../../components/deals/DealInfoSection";
import DealTabsSection from "../../components/deals/DealTabsSection";
import DealGallery from "../../components/deals/DealGallery";
import DealSupplierSection from "../../components/deals/DealSupplierSection";
import DealBadge from "../../components/deals/DealBadge";
import CountdownTimer from "../../components/deals/CountdownTimer";
import { COLORS } from "../../utils/colors";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import SiteFooter from "../../components/SiteFooter";
import DownloadAppModal from "../../components/deals/DownloadAppModal";
import ComingSoonModal from "../../components/ComingSoonModal";
import { useJoinDeal } from "../../hooks/useJoinDeal";
import { useDealDetail } from "../../hooks/useDealDetail";
import type { DealType } from "../../types/deals";

const VALID_DEAL_TYPES: DealType[] = ["voucher", "original", "cold"];

export default function DealDetailsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { id } = router.query;

  // Extract countryCode and lang from router if available, or use defaults
  const countryCode = Array.isArray(router.query.countryCode)
    ? router.query.countryCode[0]
    : router.query.countryCode || "saudi";
  const lang =
    (Array.isArray(router.query.lang)
      ? router.query.lang[0]
      : router.query.lang) ||
    router.locale ||
    "en";
  const isRTL = lang === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";
  const tx = (key: string, en: string, ar: string) =>
    t(key, { defaultValue: isRTL ? ar : en });

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n, lang]);

  const rawType = Array.isArray(router.query.type) ? router.query.type[0] : router.query.type;
  const dealType = VALID_DEAL_TYPES.includes(rawType as DealType) ? (rawType as DealType) : null;
  const dealId = typeof id === "string" ? id : null;

  const { deal, isLoading: isDealLoading, error: dealError } = useDealDetail(
    dealType,
    dealId,
    isRTL ? "ar" : "en"
  );
  const { handleJoinDeal, showDesktopModal, closeDesktopModal, showComingSoon, closeComingSoon } = useJoinDeal();

  const handleShareDeal = async () => {
    if (typeof window === "undefined") return;

    const shareData = {
      title: deal?.title || tx("dealDetails.pageTitle", "Deal Details", "تفاصيل العرض"),
      text: deal?.productName || deal?.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // User cancelled share or clipboard unavailable — no-op.
    }
  };

  const isLoading = !router.isReady || typeof id !== "string" || isDealLoading;
  const isNotFound = dealError?.status === 404;

  const backIconPath = isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {tx("dealDetails.loading", "Loading deal details...", "جاري تحميل تفاصيل العرض...")}
          </p>
        </div>
      </div>
    );
  }

  // Deal not found state
  if (!deal) {
    return (
      <div
        className="min-h-screen"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <MainNavbar countryCode={countryCode} lang={lang} />
        </div>

        {/* Mobile Navbar with Back Button */}
        <div className="md:hidden sticky top-0 z-50 bg-primary-500/95 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-soft">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-11 h-11 me-3 text-white hover:bg-white/10 rounded-full transition-colors duration-200 ease-spring"
              aria-label={tx("dealDetails.back", "Go Back", "رجوع")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={backIconPath}
                />
              </svg>
            </button>
            <h1 className="text-white text-lg font-semibold">
              {tx("dealDetails.pageTitle", "Deal Details", "تفاصيل العرض")}
            </h1>
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              {isNotFound
                ? tx("dealDetails.notFound.title", "Deal Not Found", "العرض غير موجود")
                : tx("dealDetails.error.title", "Couldn't load this deal", "تعذر تحميل هذا العرض")}
            </h2>
            <p className="text-gray-600 mb-6">
              {isNotFound
                ? tx(
                    "dealDetails.notFound.description",
                    "The deal you're looking for doesn't exist or may have been removed.",
                    "العرض الذي تبحث عنه غير موجود أو ربما تمت إزالته."
                  )
                : tx(
                    "dealDetails.error.description",
                    "Something went wrong while fetching this deal. Please try again.",
                    "حدث خطأ أثناء جلب هذا العرض. يرجى المحاولة مرة أخرى."
                  )}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center min-h-11 px-8 py-2.5 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-500/90 transition-colors duration-200 ease-spring"
            >
              {tx("dealDetails.back", "Go Back", "رجوع")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: COLORS.mainBackground }}
    >
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <MainNavbar countryCode={countryCode} lang={lang} />
      </div>

      {/* Mobile layout — matches native app UI */}
      <div className="md:hidden pb-24">
        <DealGallery images={deal.images} variant="hero" />

        <div className="relative z-10 -mt-8 rounded-t-[28px] bg-white overflow-hidden">
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-primary-500 leading-tight">{deal.title}</h1>
                {deal.productName ? (
                  <p className="mt-1 text-sm font-normal text-[#808080]">{deal.productName}</p>
                ) : null}
                <div className="mt-3">
                  <DealBadge dealType={deal.dealType} size="sm" isActive={deal.isActive} />
                </div>
              </div>
              <CountdownTimer
                timer={deal.timer}
                textColor="text-[#2B64E3]"
                className="shrink-0"
                locale={locale}
                labels={{
                  days: tx("dealDetails.timer.day", "Day", "يوم"),
                  hours: tx("dealDetails.timer.hours", "Hrs", "ساعة"),
                  minutes: tx("dealDetails.timer.minutes", "Mins", "دقيقة"),
                  seconds: tx("dealDetails.timer.seconds", "Secs", "ثانية"),
                }}
              />
            </div>
          </div>

          <DealTabsSection deal={deal} variant="mobile" />
        </div>
      </div>

      {/* Desktop layout */}
      <main className="hidden md:block container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors mb-6 min-h-11"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={backIconPath} />
          </svg>
          {tx("dealDetails.back", "Go Back", "رجوع")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-6">
          <DealGallery images={deal.images} />
          <DealInfoSection deal={deal} />
        </div>

        <DealSupplierSection deal={deal} className="mb-10" />

        <DealTabsSection deal={deal} />
      </main>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-[60] px-4 pb-4 pt-2">
        <div className="flex items-center gap-3 rounded-[28px] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={handleShareDeal}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-white transition-colors hover:bg-primary-500/90"
            aria-label={tx("dealDetails.share", "Share deal", "مشاركة العرض")}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleJoinDeal}
            className="flex-1 min-h-12 rounded-full bg-primary-500 px-6 text-base font-semibold text-white transition-colors hover:bg-primary-500/90"
          >
            {tx("dealDetails.joinDeal", "Join deal", "انضم للعرض")}
          </button>
        </div>
      </div>

      <DownloadAppModal isOpen={showDesktopModal} onClose={closeDesktopModal} />
      <ComingSoonModal isOpen={showComingSoon} onClose={closeComingSoon} />

      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const queryLang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
  const translationLocale =
    queryLang === "ar" || queryLang === "en" ? queryLang : locale ?? "en";

  return {
    props: {
      ...(await serverSideTranslations(translationLocale, ["common"])),
    },
  };
};
