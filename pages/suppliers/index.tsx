import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import ShopGridHeader from "../../components/ecommerce/ShopGridHeader";
import ShopIconGrid, { ShopIconGridSkeleton } from "../../components/ecommerce/ShopIconGrid";
import { useSuppliers } from "../../hooks/useSuppliers";
import { COLORS } from "../../utils/colors";

const DEFAULT_COUNTRY = "egy";

export default function SuppliersPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const lang = router.locale || i18n.language || "en";
  const isRTL = lang === "ar";
  const { suppliers, isLoading, error } = useSuppliers();

  const pageTitle = t("store.suppliersPageTitle", {
    defaultValue: isRTL ? "الموردون" : "Suppliers",
  });

  const gridItems = suppliers.map((supplier) => ({
    id: supplier.id,
    href: supplier.link,
    label: isRTL ? supplier.name_ar : supplier.name_en,
    imageSrc: supplier.logoUrl,
    imageFit: "contain" as const,
  }));

  return (
    <>
      <Head>
        <title>{`${pageTitle} | Sharena`}</title>
      </Head>

      <div
        className="min-h-screen"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <ShopGridHeader title={pageTitle} />

        <div className="hidden md:block">
          <MainNavbar countryCode={DEFAULT_COUNTRY} lang={lang} />
        </div>

        <main className="px-4 pb-8 pt-4 md:container md:mx-auto md:max-w-5xl md:px-8 md:py-8">
          <h1 className="mb-6 hidden text-2xl font-bold tracking-tight text-primary-500 md:block">
            {pageTitle}
          </h1>

          {isLoading ? (
            <ShopIconGridSkeleton />
          ) : error || gridItems.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              {t("store.suppliersEmpty", {
                defaultValue: isRTL ? "لا يوجد موردون متاحون." : "No suppliers available.",
              })}
            </p>
          ) : (
            <ShopIconGrid items={gridItems} imageFit="contain" />
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
