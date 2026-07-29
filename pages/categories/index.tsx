import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import ShopGridHeader from "../../components/ecommerce/ShopGridHeader";
import ShopIconGrid, { ShopIconGridSkeleton } from "../../components/ecommerce/ShopIconGrid";
import { useCategories } from "../../hooks/useCategories";
import { COLORS } from "../../utils/colors";

const DEFAULT_COUNTRY = "egy";

const FALLBACK_CATEGORIES = [
  { id: "1", title: "Donate For Gaza", image: "/dummy_images/palastine.png", link: "/donate" },
  { id: "5", title: "Men's Fashion", image: "/dummy_images/man_fashon.png", link: "/mens-fashion" },
  { id: "9", title: "Mobiles", image: "/dummy_images/mobile1.png", link: "/mobiles" },
  { id: "6", title: "Women's Fashion", image: "/dummy_images/woman_fashon.png", link: "/womens-fashion" },
  { id: "7", title: "Kids' Fashion", image: "/dummy_images/kids_fashon.png", link: "/kids-fashion" },
  { id: "2", title: "Summer Store", image: "/dummy_images/summer.png", link: "/summer" },
  { id: "3", title: "Installments & Discounts", image: "/dummy_images/installments.png", link: "/installments" },
  { id: "4", title: "Bestsellers", image: "/dummy_images/bestsellers.png", link: "/bestsellers" },
  { id: "8", title: "Home & Kitchen", image: "/dummy_images/home_kitchen.png", link: "/home-kitchen" },
  { id: "10", title: "Beauty", image: "/dummy_images/beauty.png", link: "/beauty" },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const lang = router.locale || i18n.language || "en";
  const isRTL = lang === "ar";
  const { categories, isLoading, error } = useCategories();

  const pageTitle = t("store.categoriesPageTitle", {
    defaultValue: isRTL ? "الفئات" : "Categories",
  });

  const useFallback = !isLoading && (error !== null || categories.length === 0);
  const gridItems = useFallback
    ? FALLBACK_CATEGORIES.map((category) => ({
        id: String(category.id),
        href: category.link,
        label: category.title,
        imageSrc: category.image,
        imageFit: "cover" as const,
      }))
    : categories.map((category) => ({
        id: category.id,
        href: category.link,
        label: isRTL ? category.name_ar : category.name_en,
        imageSrc: category.iconUrl,
        imageFit: "cover" as const,
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
          ) : gridItems.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              {t("store.categoriesEmpty", {
                defaultValue: isRTL ? "لا توجد فئات متاحة." : "No categories available.",
              })}
            </p>
          ) : (
            <ShopIconGrid items={gridItems} imageFit="cover" />
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
