import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import DealInfoSection from "../../components/deals/DealInfoSection";
import DealTabsSection from "../../components/deals/DealTabsSection";
import DealGallery from "../../components/deals/DealGallery";
import { DEAL_THEMES } from "../../types/deals";
import { COLORS } from "../../utils/colors";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import SiteFooter from "../../components/SiteFooter";
import DownloadAppModal from "../../components/deals/DownloadAppModal";
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
    : router.query.countryCode || "egy";
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
  const { handleJoinDeal, showDesktopModal, closeDesktopModal } = useJoinDeal();

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

      <main className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-32 md:pb-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors mb-6 min-h-11"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={backIconPath} />
          </svg>
          {tx("dealDetails.back", "Go Back", "رجوع")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10">
          <DealGallery images={deal.images} />
          <DealInfoSection deal={deal} />
        </div>

        <DealTabsSection deal={deal} />
      </main>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/10 px-4 py-3 shadow-soft-lg">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <p className="text-xs text-gray-500">{t("deals.dealPrice")}</p>
            <p className="text-lg font-bold" style={{ color: DEAL_THEMES[deal.dealType].primary }}>
              {deal.dealPrice.toLocaleString(locale)}
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-gray-500">{t("deals.save")}</p>
            <p className="text-sm font-semibold text-emerald-600">
              +{deal.saveAmount.toLocaleString(locale)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleJoinDeal}
          className="w-full min-h-11 rounded-full text-white font-semibold"
          style={{ backgroundColor: DEAL_THEMES[deal.dealType].primary }}
        >
          {tx("dealDetails.joinDeal", "Join Deal", "انضم للعرض")}
        </button>
      </div>

      <DownloadAppModal isOpen={showDesktopModal} onClose={closeDesktopModal} />

      <SiteFooter />
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
