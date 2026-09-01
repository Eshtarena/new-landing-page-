import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";

/**
 * Shared SSR translations loader for deal detail routes.
 * Prefers Next.js locale over ?lang= to stay in sync with LanguageSwitcher.
 */
export async function getDealPageServerSideProps({
  locale,
  query,
}: Pick<GetServerSidePropsContext, "locale" | "query">) {
  const queryLang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
  const translationLocale =
    (locale === "ar" || locale === "en" ? locale : undefined) ??
    (queryLang === "ar" || queryLang === "en" ? queryLang : undefined) ??
    "en";

  return {
    props: {
      ...(await serverSideTranslations(translationLocale, ["common"])),
    },
  };
}
