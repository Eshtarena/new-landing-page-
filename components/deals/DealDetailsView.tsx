import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { Deal, DealType } from "../../types/deals";
import DealInfoSection from "./DealInfoSection";
import DealTabsSection from "./DealTabsSection";
import DealGallery from "./DealGallery";
import DealBadge from "./DealBadge";
import CountdownTimer from "./CountdownTimer";
import DownloadAppModal from "./DownloadAppModal";
import { COLORS } from "../../utils/colors";
import MainNavbar from "../ecommerce/MainNavbar";
import { useJoinDeal } from "../../hooks/useJoinDeal";
import { getLatestCountryCode } from "../../utils/countryPreference";
import { isValidCountry } from "../../utils/routes";
import { fetchVoucherDetails, mapVoucherApiToDeal, type Lang } from "../../services/voucherApi";
import {
  fetchColdDetails,
  fetchOriginalDetails,
  mapColdApiToDeal,
  mapOriginalApiToDeal,
} from "../../services/dealDetailsApi";
import { SocialService } from "../../services";
import { DEAL_DETAILS_LABELS } from "../../utils/dealDetailsLabels";

interface DealDetailsViewProps {
  /** The deal id from the URL (voucherid or dealid) */
  id: string | undefined;
  /** Deal type for this route - used for shared link paths and future API calls */
  dealType: DealType;
}

/**
 * Resolve countryCode: from query, then latest selected in storage, then default "egy".
 */
function resolveCountryCode(
  queryCountry: string | string[] | undefined
): string {
  const fromQuery =
    typeof queryCountry === "string"
      ? queryCountry
      : Array.isArray(queryCountry)
        ? queryCountry[0]
        : undefined;
  if (fromQuery && isValidCountry(fromQuery)) return fromQuery;
  const latest = getLatestCountryCode();
  if (latest) return latest;
  return "egy";
}

/**
 * Resolve lang from query string. Used for deal content and UI language.
 */
function resolveLangFromQuery(queryLang: string | string[] | undefined): Lang {
  const q = Array.isArray(queryLang) ? queryLang[0] : queryLang;
  return q === "ar" ? "ar" : "en";
}

/** Get lang from current URL (client-safe). Use so ?lang=ar is respected even before router is ready. */
function getLangFromUrl(routerQueryLang: string | string[] | undefined): Lang {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "ar") return "ar";
  }
  return resolveLangFromQuery(routerQueryLang);
}

export default function DealDetailsView({ id, dealType }: DealDetailsViewProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string>("egy");
  // Initialize lang from URL on client so Arabic shows immediately when ?lang=ar
  const [lang, setLang] = useState<Lang>(() =>
    typeof window !== "undefined" ? getLangFromUrl(undefined) : "en"
  );
  const [storeLinks, setStoreLinks] = useState<{ apple: string; google: string }>({
    apple: "https://apps.apple.com/app/eshtarena",
    google: "https://play.google.com/store/apps/details?id=eshtarena.app",
  });

  useEffect(() => {
    const defaultApple = "https://apps.apple.com/app/eshtarena";
    const defaultGoogle = "https://play.google.com/store/apps/details?id=eshtarena.app";
    SocialService.getLinks()
      .then((data) => {
        setStoreLinks({
          apple: data.apple || defaultApple,
          google: data.google || defaultGoogle,
        });
      })
      .catch(() => {});
  }, []);

  // Sync lang from URL so UI and content show Arabic when ?lang=ar (client: read from window so it works before router is ready)
  useEffect(() => {
    const nextLang = getLangFromUrl(router.query.lang);
    setLang(nextLang);
  }, [router.isReady, router.query.lang]);

  useEffect(() => {
    if (typeof i18n?.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when lang (from URL) changes
  }, [lang]);

  // Resolve countryCode from URL, then latest selected, then default (client-safe)
  useEffect(() => {
    setCountryCode(
      resolveCountryCode(router.query.countryCode)
    );
  }, [router.query.countryCode]);

  useEffect(() => {
    if (!router.isReady || !id || typeof id !== "string") {
      if (!router.isReady) return;
      setIsLoading(false);
      return;
    }

    // Use URL lang so content (payment terms, description, etc.) is in correct language (?lang=ar)
    const effectiveLang = getLangFromUrl(router.query.lang);

    let cancelled = false;

    if (dealType === "voucher") {
      fetchVoucherDetails(id)
        .then((data) => {
          if (cancelled) return;
          setDeal(mapVoucherApiToDeal(data, effectiveLang));
        })
        .catch(() => {
          if (cancelled) return;
          // Do not use dummy data – show deal not found
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => { cancelled = true; };
    }

    if (dealType === "cold") {
      fetchColdDetails(id)
        .then((data) => {
          if (cancelled) return;
          const mapped = mapColdApiToDeal(data, effectiveLang);
          if (mapped) setDeal(mapped);
          // If mapping fails, deal stays null – show deal not found
        })
        .catch(() => {
          if (cancelled) return;
          // Do not use dummy data
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => { cancelled = true; };
    }

    if (dealType === "original") {
      fetchOriginalDetails(id)
        .then((data) => {
          if (cancelled) return;
          const mapped = mapOriginalApiToDeal(data, effectiveLang);
          if (mapped) setDeal(mapped);
        })
        .catch(() => {
          if (cancelled) return;
          // Do not use dummy data
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => { cancelled = true; };
    }

    setIsLoading(false);
  }, [id, dealType, lang, router.isReady, router.query.lang]);

  const isRtl = lang === "ar";
  const labels = DEAL_DETAILS_LABELS[lang];
  const locale = isRtl ? "ar-SA" : "en-US";
  const { handleJoinDeal, showDesktopModal, closeDesktopModal } = useJoinDeal();

  const handleShareDeal = async () => {
    if (typeof window === "undefined" || !deal) return;

    const shareData = {
      title: deal.title || labels.pageTitle,
      text: deal.productName || deal.title,
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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isRtl ? "rtl" : "ltr"}`}
        style={{ backgroundColor: COLORS.mainBackground }}
        dir={isRtl ? "rtl" : "ltr"}
        lang={lang}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{labels.loading}</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div
        className={`min-h-screen ${isRtl ? "rtl" : "ltr"}`}
        style={{ backgroundColor: COLORS.mainBackground }}
        dir={isRtl ? "rtl" : "ltr"}
        lang={lang}
      >
        <div className="hidden md:block">
          <MainNavbar countryCode={countryCode} lang={lang} />
        </div>
        <div className="md:hidden bg-[#340040] shadow-md">
          <div className={`flex items-center px-4 py-4 ${isRtl ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => router.push(`/`)}
              className={`flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors ${isRtl ? "ml-3" : "mr-3"}`}
              aria-label={labels.goBack}
            >
              <svg
                className={`w-6 h-6 ${isRtl ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-white text-lg font-semibold">{labels.pageTitle}</h1>
          </div>
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {labels.dealNotFound}
            </h2>
            <p className="text-gray-600 mb-6">
              {labels.dealNotFoundMessage}
            </p>
            <button
              onClick={() => router.push(`/${countryCode}${lang === "ar" ? "?lang=ar" : ""}`)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {labels.goBack}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isRtl ? "rtl" : "ltr"}`}
      style={{ backgroundColor: COLORS.mainBackground }}
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
    >
      <div className="hidden md:block">
        <MainNavbar countryCode={countryCode} lang={lang} />
      </div>

      {/* Mobile layout */}
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
                  days: t("dealDetails.timer.day", { defaultValue: isRtl ? "يوم" : "Day" }),
                  hours: t("dealDetails.timer.hours", { defaultValue: isRtl ? "ساعة" : "Hrs" }),
                  minutes: t("dealDetails.timer.minutes", { defaultValue: isRtl ? "دقيقة" : "Mins" }),
                  seconds: t("dealDetails.timer.seconds", { defaultValue: isRtl ? "ثانية" : "Secs" }),
                }}
              />
            </div>
          </div>

          <DealTabsSection deal={deal} variant="mobile" />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <DealInfoSection deal={deal} storeLinks={storeLinks} />
          <DealTabsSection deal={deal} />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-[60] px-4 pb-4 pt-2">
        <div className="flex items-center gap-3 rounded-[28px] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={handleShareDeal}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-white transition-colors hover:bg-primary-500/90"
            aria-label={t("dealDetails.share", { defaultValue: isRtl ? "مشاركة العرض" : "Share deal" })}
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
            {t("dealDetails.joinDeal", { defaultValue: isRtl ? "انضم للعرض" : "Join deal" })}
          </button>
        </div>
      </div>

      <DownloadAppModal isOpen={showDesktopModal} onClose={closeDesktopModal} />
    </div>
  );
}
