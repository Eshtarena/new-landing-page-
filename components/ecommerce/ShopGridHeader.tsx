import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { SHOP_HEADER_STYLE } from "../../utils/shopHeaderStyle";

interface ShopGridHeaderProps {
  title: string;
  backLabel?: string;
  onBack?: () => void;
}

export default function ShopGridHeader({ title, backLabel, onBack }: ShopGridHeaderProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const lang = router.locale || i18n.language || "en";
  const isRTL = lang === "ar";
  const backIconPath = isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";
  const resolvedBackLabel =
    backLabel ??
    t("supplierDetails.back", { defaultValue: isRTL ? "رجوع" : "Go Back" });

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <header
      className="sticky top-0 z-50 relative rounded-b-[28px] md:hidden"
      style={SHOP_HEADER_STYLE}
    >
      <div className="relative px-4 pt-8 pb-7">
        <div className="flex items-center gap-3 min-h-14">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 shrink-0 text-white hover:bg-white/10 rounded-full transition-colors duration-200 ease-spring"
            aria-label={resolvedBackLabel}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={backIconPath} />
            </svg>
          </button>
          <h1 className="text-white text-lg font-semibold truncate">{title}</h1>
        </div>
      </div>
    </header>
  );
}
