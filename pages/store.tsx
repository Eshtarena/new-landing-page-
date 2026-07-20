import React, { useCallback, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../components/ecommerce/MainNavbar";
import MegaDeals from "../components/ecommerce/MegaDeals";
import SiteFooter from "../components/SiteFooter";
import { useCategories } from "../hooks/useCategories";

const DEFAULT_COUNTRY = "egy";

export default function StorePage() {
  const router = useRouter();
  const { i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const lang = router.locale || "en";
  const categoryId =
    typeof router.query.category === "string" ? router.query.category : undefined;

  const { categories } = useCategories();
  const activeCategory = categoryId
    ? categories.find((category) => category.id === categoryId)
    : undefined;
  const categoryTitle = activeCategory
    ? isRTL
      ? activeCategory.name_ar
      : activeCategory.name_en
    : undefined;

  const [openMobileFilter, setOpenMobileFilter] = useState<(() => void) | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegisterMobileFilter = useCallback((openFilter: () => void) => {
    setOpenMobileFilter(() => openFilter);
  }, []);

  const pageTitle = categoryTitle
    ? `${categoryTitle} | Sharena`
    : "Store | Sharena";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            categoryTitle
              ? isRTL
                ? `تصفح عروض ${categoryTitle} على إشتارينا`
                : `Browse ${categoryTitle} deals on Sharena`
              : "Browse deals by category on Sharena"
          }
        />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <MainNavbar
          countryCode={DEFAULT_COUNTRY}
          lang={lang}
          onMobileFilterOpen={openMobileFilter ?? undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 w-full min-w-0">
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-4 md:pt-6">
            <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href={`/${DEFAULT_COUNTRY}`}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {isRTL ? "الرئيسية" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-900 font-medium truncate">
                  {categoryTitle || (isRTL ? "المتجر" : "Store")}
                </li>
              </ol>
            </nav>
          </div>

          <MegaDeals
            initialCategoryId={categoryId}
            onRegisterMobileFilter={handleRegisterMobileFilter}
            search={searchQuery}
          />
        </main>

        <SiteFooter />
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
