import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import SiteFooter from "../../components/SiteFooter";
import SupplierTabsSection from "../../components/suppliers/SupplierTabsSection";
import SupplierMobileTabs from "../../components/suppliers/SupplierMobileTabs";
import { useSupplierDetail } from "../../hooks/useSupplierDetail";
import { COLORS } from "../../utils/colors";
import { SHOP_HEADER_STYLE } from "../../utils/shopHeaderStyle";

const DEFAULT_COUNTRY = "saudi";

const MOBILE_TABS = [
  { id: "about", labelKey: "about" },
  { id: "branches", labelKey: "branches" },
  { id: "productDeals", labelKey: "originalDeals" },
  { id: "coldDeals", labelKey: "coldDealsShort" },
  { id: "vouchers", labelKey: "vouchers" },
] as const;

function resolveMobileTabLabel(
  labelKey: (typeof MOBILE_TABS)[number]["labelKey"],
  tx: (key: string, en: string, ar: string) => string
) {
  switch (labelKey) {
    case "about":
      return tx("supplierDetails.tabs.about", "About", "نبذة");
    case "branches":
      return tx("supplierDetails.tabs.branches", "Branches", "الفروع");
    case "originalDeals":
      return tx("supplierDetails.tabs.originalDeals", "Original deals", "العروض الأصلية");
    case "coldDealsShort":
      return tx("supplierDetails.tabs.coldDealsShort", "Cold deals", "العروض الباردة");
    case "vouchers":
      return tx("supplierDetails.tabs.vouchers", "Vouchers", "الكوبونات");
  }
}

export default function SupplierDetailsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { id } = router.query;
  const lang = router.locale || "en";
  const isRTL = i18n.language === "ar";
  const tx = (key: string, en: string, ar: string) => t(key, { defaultValue: isRTL ? ar : en });

  const supplierId = typeof id === "string" ? id : null;
  const [activeTab, setActiveTab] = useState("about");
  const {
    supplier,
    originalDeals,
    coldDeals,
    voucherDeals,
    isLoading: isSupplierLoading,
    error,
  } = useSupplierDetail(supplierId, isRTL ? "ar" : "en");

  const isLoading = !router.isReady || typeof id !== "string" || isSupplierLoading;
  const isNotFound = error?.status === 404;
  const backIconPath = isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">
            {tx("supplierDetails.loading", "Loading supplier profile...", "جاري تحميل ملف المورد...")}
          </p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        className="min-h-screen"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <MainNavbar countryCode={DEFAULT_COUNTRY} lang={lang} />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              {isNotFound
                ? tx("supplierDetails.notFound.title", "Supplier Not Found", "المورد غير موجود")
                : tx("supplierDetails.error.title", "Couldn't load this supplier", "تعذر تحميل بيانات المورد")}
            </h2>
            <p className="text-gray-600 mb-6">
              {isNotFound
                ? tx(
                    "supplierDetails.notFound.description",
                    "The supplier you're looking for doesn't exist or may have been removed.",
                    "المورد الذي تبحث عنه غير موجود أو ربما تمت إزالته."
                  )
                : tx(
                    "supplierDetails.error.description",
                    "Something went wrong while fetching this supplier. Please try again.",
                    "حدث خطأ أثناء جلب بيانات المورد. يرجى المحاولة مرة أخرى."
                  )}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center min-h-11 px-8 py-2.5 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-500/90 transition-colors duration-200 ease-spring"
            >
              {tx("supplierDetails.back", "Go Back", "رجوع")}
            </button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const supplierName = isRTL ? supplier.name_ar : supplier.name_en;
  const mobileTabs = MOBILE_TABS.map((tab) => ({
    id: tab.id,
    label: resolveMobileTabLabel(tab.labelKey, tx),
  }));

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ backgroundColor: COLORS.mainBackground }}>
      <Head>
        <title>{`${supplierName} | Sharena`}</title>
      </Head>

      <div className="hidden md:block">
        <MainNavbar countryCode={DEFAULT_COUNTRY} lang={lang} />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden min-h-screen pb-8" style={{ backgroundColor: COLORS.mainBackground }}>
        <header
          className="sticky top-0 z-50 relative rounded-b-[28px]"
          style={SHOP_HEADER_STYLE}
        >
          <div className="relative px-4 pt-6 pb-2">
            <div className="flex items-center gap-3 min-h-11">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 shrink-0 text-white hover:bg-white/10 rounded-full transition-colors duration-200 ease-spring"
                aria-label={tx("supplierDetails.back", "Go Back", "رجوع")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={backIconPath} />
                </svg>
              </button>
              <h1 className="text-white text-lg font-semibold truncate">
                {tx("supplierDetails.pageTitle", "Supplier Profile", "ملف المورد")}
              </h1>
            </div>

            <SupplierMobileTabs
              tabs={mobileTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              ariaLabel={tx("supplierDetails.pageTitle", "Supplier Profile", "ملف المورد")}
              className="mt-1"
            />
          </div>
        </header>

        <div className="px-4 pt-4 space-y-3">
          {activeTab === "about" ? (
            <MobileSupplierProfileCard supplier={supplier} supplierName={supplierName} tx={tx} />
          ) : null}

          <SupplierTabsSection
            supplier={supplier}
            originalDeals={originalDeals}
            coldDeals={coldDeals}
            voucherDeals={voucherDeals}
            variant="mobile"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hideMobileNav
          />
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
          {tx("supplierDetails.back", "Go Back", "رجوع")}
        </button>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-soft border border-black/5 mb-8">
          <SupplierHeader supplier={supplier} supplierName={supplierName} tx={tx} variant="desktop" />
        </div>

        <SupplierTabsSection
          supplier={supplier}
          originalDeals={originalDeals}
          coldDeals={coldDeals}
          voucherDeals={voucherDeals}
        />
      </main>

      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </div>
  );
}

function MobileSupplierProfileCard({
  supplier,
  supplierName,
  tx,
}: {
  supplier: NonNullable<ReturnType<typeof useSupplierDetail>["supplier"]>;
  supplierName: string;
  tx: (key: string, en: string, ar: string) => string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {supplier.logoUrl ? (
          <Image
            src={supplier.logoUrl}
            alt={supplierName}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-500 font-bold text-sm">
            {supplierName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-primary-500 truncate">{supplierName}</h2>
        {supplier.founded ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs font-normal text-[#808080]">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {tx("supplierDetails.founded", "Founded", "تأسست عام")}: {supplier.founded}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SupplierHeader({
  supplier,
  supplierName,
  tx,
  variant,
}: {
  supplier: NonNullable<ReturnType<typeof useSupplierDetail>["supplier"]>;
  supplierName: string;
  tx: (key: string, en: string, ar: string) => string;
  variant: "mobile" | "desktop";
}) {
  const isMobile = variant === "mobile";

  return (
    <div className={`flex flex-col items-center text-center gap-4 ${isMobile ? "" : "md:flex-row md:items-center md:text-start md:gap-6"}`}>
      <div
        className={`relative overflow-hidden rounded-full border border-black/5 bg-white shadow-soft shrink-0 ${
          isMobile ? "h-20 w-20" : "h-24 w-24 md:h-28 md:w-28"
        }`}
      >
        {supplier.logoUrl ? (
          <Image
            src={supplier.logoUrl}
            alt={supplierName}
            fill
            sizes="112px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-500 font-bold text-2xl">
            {supplierName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h1
          className={`font-bold tracking-tight text-gray-900 ${
            isMobile ? "text-xl" : "text-2xl md:text-3xl"
          }`}
        >
          {supplierName}
        </h1>

        {supplier.founded ? (
          <p className="text-sm text-gray-500 mt-1">
            {tx("supplierDetails.founded", "Founded", "تأسست عام")} {supplier.founded}
          </p>
        ) : null}

        {supplier.categories && supplier.categories.length > 0 ? (
          <div className={`flex flex-wrap gap-2 mt-3 ${isMobile ? "justify-center" : "md:justify-start"}`}>
            {supplier.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-500 border border-primary-500/10"
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
