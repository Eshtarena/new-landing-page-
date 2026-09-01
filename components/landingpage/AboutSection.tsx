import { useTranslation } from "next-i18next/pages";
import Image from "next/image";
import AppStoreBadges from "../AppStoreBadges";

export default function AboutSection() {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  return (
    <div
      id="about"
      className={`px-4 sm:px-6 lg:px-24 mx-auto pt-14 sm:pt-16 md:pt-20 pb-8 md:pb-12 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Content Section */}
        <div className="max-w-xl mx-auto lg:mx-0">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6 leading-[1.15] text-center lg:text-start">
            {isRTL ? (
              <div>
                {t("about.mainTitleLine1")}{" "}
                <span className="bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                  {t("about.mainTitleLine2")}
                </span>
              </div>
            ) : (
              <div>
                <div>{t("about.mainTitleLine1")}</div>
                <div className="mt-2 bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                  {t("about.mainTitleLine2")}
                </div>
              </div>
            )}
          </h1>

          <div className="space-y-4 sm:space-y-6">
            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed text-center lg:text-start">
              {t("about.mainDescription")}
            </p>
            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed text-center lg:text-start">
              {t("about.priceDescription")}
            </p>
            <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed text-center lg:text-start">
              {t("about.discountDescription")}
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center py-4 sm:py-6">
          <div className="relative w-full max-w-[620px] mx-auto">
            <Image
              src="/new-all.png"
              alt="Group purchasing deals across the app"
              width={1431}
              height={1233}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Download CTA — centered below the section */}
      <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
        <div className="w-full max-w-2xl p-5 sm:p-8 md:p-10 bg-gray-50/70 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
            {t("about.downloadTitle")}
          </h3>
          <AppStoreBadges
            containerClassName="flex flex-wrap gap-4 items-center justify-center"
            badgeClassName="w-[180px] h-[53px] relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/20"
          />
        </div>
      </div>
    </div>
  );
}
