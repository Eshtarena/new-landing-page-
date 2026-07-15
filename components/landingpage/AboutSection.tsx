import { useTranslation } from "next-i18next/pages";
import Image from "next/image";
import { LANDING_IMAGES, STORES_IMAGES_LINKS } from "../../utils/consts";

export default function AboutSection({socialData} ) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const yourNeedsImage = isRTL
    ? LANDING_IMAGES.ar.yourNeedsEasily
    : LANDING_IMAGES.en.yourNeedsEasily;

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
        <div className="flex justify-center">
          <div className="relative isolate w-full max-w-[500px] mx-auto">
            {/* Decorative glow behind the mockups */}
            <div
              aria-hidden="true"
              className="absolute w-[120%] h-[120%] left-[-10%] top-[-10%] bg-linear-to-tr from-primary-500/30 via-purple-500/20 to-transparent blur-3xl rounded-full -z-10"
            />
            <div className="relative aspect-3/4 motion-safe:animate-float">
              <Image
                src={yourNeedsImage}
                alt="Eshtarena App Screenshots"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download CTA — centered below the section */}
      <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
        <div className="w-full max-w-2xl p-5 sm:p-8 md:p-10 bg-gray-50/70 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
            {t("about.downloadTitle")}
          </h3>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <a
              href={socialData.apple}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[180px] h-[53px] relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/20"
            >
              <Image
                src={isRTL ? STORES_IMAGES_LINKS.ar.apple : STORES_IMAGES_LINKS.en.apple}
                alt="Download on the App Store"
                fill
                className="object-contain"
              />
            </a>
            <a
              href={socialData.google}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[180px] h-[53px] relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/20"
            >
              <Image
                src={isRTL ? STORES_IMAGES_LINKS.ar.google : STORES_IMAGES_LINKS.en.google}
                alt="Get it on Google Play"
                fill
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
