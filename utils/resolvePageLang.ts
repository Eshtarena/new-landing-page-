import { NextRouter } from "next/router";

export type PageLang = "en" | "ar";

function normalizeLang(value: string | string[] | undefined): PageLang | undefined {
  const lang = Array.isArray(value) ? value[0] : value;
  if (lang === "ar") return "ar";
  if (lang === "en") return "en";
  return undefined;
}

/**
 * Resolve UI/content language for localized pages.
 * router.locale (Next.js i18n) takes precedence over ?lang= so locale
 * switches do not keep a stale query param from navigation.
 */
export function resolvePageLang(
  router: Pick<NextRouter, "locale" | "query">,
  i18nLanguage?: string
): PageLang {
  const fromLocale = normalizeLang(router.locale);
  if (fromLocale) return fromLocale;

  const fromQuery = normalizeLang(router.query.lang);
  if (fromQuery) return fromQuery;

  if (i18nLanguage === "ar") return "ar";
  return "en";
}

/** Read ?lang= from the current URL (client-only fallback for v1 shared links). */
export function resolvePageLangFromSearch(search: string): PageLang {
  const urlLang = new URLSearchParams(search).get("lang");
  return urlLang === "ar" ? "ar" : "en";
}
