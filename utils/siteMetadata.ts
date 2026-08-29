/**
 * Root / default site metadata.
 * Inner routes that set their own <title> (or description) via next/head
 * continue to override these defaults without using this module.
 */
export const ARABIC_BRAND_NAME = "شَرِينا"; // Fat-ha on ش, Kasra on ر

export type SiteLocale = "en" | "ar";

export type SiteMetadata = {
  title: string;
  description: string;
  siteName: string;
  ogLocale: string;
  ogLocaleAlternate: string;
};

export const SITE_METADATA: Record<SiteLocale, SiteMetadata> = {
  en: {
    title: "Sharena | The Group Shopping App",
    description:
      "Sharena is the group shopping app for individuals and businesses — the best prices and biggest discounts on products and purchase vouchers.",
    siteName: "Sharena",
    ogLocale: "en_US",
    ogLocaleAlternate: "ar_SA",
  },
  ar: {
    title: `${ARABIC_BRAND_NAME} | تطبيق الشراء الجماعي`,
    description:
      `${ARABIC_BRAND_NAME} تطبيق الشراء الجماعي للأفراد والشركات — أفضل الأسعار وأكبر الخصومات على المنتجات وكوبونات الشراء.`,
    siteName: ARABIC_BRAND_NAME,
    ogLocale: "ar_SA",
    ogLocaleAlternate: "en_US",
  },
};

export function getSiteMetadata(locale?: string): SiteMetadata {
  return locale === "ar" ? SITE_METADATA.ar : SITE_METADATA.en;
}
