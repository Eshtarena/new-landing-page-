import React from "react";
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          router.locale === "en"
            ? "bg-white text-[#340040]"
            : "text-white/80 hover:text-white"
        }`}
      >
        English
      </button>
      <span className="text-white/60">|</span>
      <button
        onClick={() => switchLanguage("ar")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
          router.locale === "ar"
            ? "bg-white text-[#340040]"
            : "text-white/80 hover:text-white"
        }`}
      >
        العربية
      </button>
    </div>
  );
} 