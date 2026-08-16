import { useRouter } from "next/router";
import { beginLocaleSwitch } from "../utils/localeSwitch";

type Locale = "en" | "ar";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguage = async (locale: Locale) => {
    if (router.locale === locale) {
      return;
    }

    beginLocaleSwitch();

    await router.push({ pathname, query }, asPath, { locale, scroll: false });
  };

  return (
    <div className="flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      <button
        onClick={() => switchLanguage("en")}
        className={`min-w-11 min-h-11 px-3 text-sm rounded-full transition-colors duration-200 ease-spring ${
          router.locale === "en"
            ? "text-white font-semibold bg-white/10"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("ar")}
        className={`min-w-11 min-h-11 px-3 text-sm rounded-full transition-colors duration-200 ease-spring ${
          router.locale === "ar"
            ? "text-white font-semibold bg-white/10"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        عربي
      </button>
    </div>
  );
}
