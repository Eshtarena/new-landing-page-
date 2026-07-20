import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import SiteFooter from "../../components/SiteFooter";
import SupplierTabsSection from "../../components/suppliers/SupplierTabsSection";
import { useSupplierDetail } from "../../hooks/useSupplierDetail";
import { COLORS } from "../../utils/colors";

const DEFAULT_COUNTRY = "egy";

export default function SupplierDetailsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { id } = router.query;
  const lang = router.locale || "en";
  const isRTL = i18n.language === "ar";
  const tx = (key: string, en: string, ar: string) => t(key, { defaultValue: isRTL ? ar : en });

  const supplierId = typeof id === "string" ? id : null;
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

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ backgroundColor: COLORS.mainBackground }}>
      <Head>
        <title>{`${supplierName} | Sharena`}</title>
      </Head>

      <div className="hidden md:block">
        <MainNavbar countryCode={DEFAULT_COUNTRY} lang={lang} />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="sticky top-0 z-50 bg-primary-500/95 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-soft">
          <div className="flex items-center px-4 py-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-11 h-11 me-3 text-white hover:bg-white/10 rounded-full transition-colors duration-200 ease-spring"
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
        </div>

        <div className="bg-white px-4 pt-5 pb-4">
          <SupplierHeader supplier={supplier} supplierName={supplierName} tx={tx} variant="mobile" />
        </div>

        <SupplierTabsSection
          supplier={supplier}
          originalDeals={originalDeals}
          coldDeals={coldDeals}
          voucherDeals={voucherDeals}
          variant="mobile"
        />
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
