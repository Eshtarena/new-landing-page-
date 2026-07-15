import { useEffect } from "react";
import { useRouter } from "next/router";

function syncDocumentDirection(locale: string) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", locale);
}

/**
 * _document only sets <html dir/lang> on the initial server render.
 * Client-side locale switches (router.push with { locale }) update
 * translations but do not re-run _document, so layout utilities that
 * depend on html[dir] (grid order, rtl: variants, logical properties)
 * stay stale until a full reload. This keeps the root element in sync.
 */
export default function LocaleDirectionSync() {
  const router = useRouter();

  useEffect(() => {
    syncDocumentDirection(router.locale || "en");
  }, [router.locale]);

  return null;
}
