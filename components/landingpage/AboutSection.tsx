import { useTranslation } from "next-i18next";
import Image from "next/image";
import { LANDING_IMAGES, STORES_IMAGES_LINKS } from "../../utils/consts";

export default function AboutSection() {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const yourNeedsImage = isRTL
    ? LANDING_IMAGES.ar.yourNeedsEasily
    : LANDING_IMAGES.en.yourNeedsEasily;

  return (
    <div
      id="about"
      className="md:px-[100px] px-[20px] mx-auto   md:py-20 py-8 "
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Content Section - Order changes based on language */}
        <div
          className={`w-full lg:w-1/2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}
        >
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#340040] leading-tight mb-8 text-center lg:text-${
              isRTL ? "end" : "start"
            }`}
          >
            {isRTL ? (
              <div>
                {t("about.mainTitleLine1")} {t("about.mainTitleLine2")}
              </div>
            ) : (
              <div>
                <div>{t("about.mainTitleLine1")}</div>
                <div className="mt-2">{t("about.mainTitleLine2")}</div>
              </div>
            )}
          </h1>

          <div
            className={`space-y-6 text-lg text-gray-600 ${
              isRTL ? "rtl" : "ltr"
            }`}
          >
            <p className={`text-center lg:text-${isRTL ? "end" : "start"}`}>
              {t("about.mainDescription")}
            </p>
            <p className={`text-center lg:text-${isRTL ? "end" : "start"}`}>
              {t("about.priceDescription")}
            </p>
            <p className={`text-center lg:text-${isRTL ? "end" : "start"}`}>
              {t("about.discountDescription")}
            </p>
          </div>

          <div className="mt-12">
            <h3
              className={`text-xl text-[#340040] font-semibold mb-6 text-center lg:text-${
                isRTL ? "end" : "start"
              }`}
            >
              {t("about.downloadTitle")}
            </h3>
            <div
              className={`flex flex-wrap gap-6 justify-center lg:justify-${
                isRTL ? "end" : "start"
              }`}
            >
              <a
                href="https://apps.apple.com/app/eshtarena"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[180px] h-[53px] relative hover:opacity-90 transition-opacity"
              >
                <Image
                  src={STORES_IMAGES_LINKS.apple}
                  alt="Download on the App Store"
                  fill
                  className="object-contain"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.eshtarena"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[180px] h-[53px] relative hover:opacity-90 transition-opacity"
              >
                <Image
                  src={STORES_IMAGES_LINKS.google}
                  alt="Get it on Google Play"
                  fill
                  className="object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div
          className={`w-full lg:w-1/2 ${
            isRTL ? "lg:order-1" : "lg:order-2"
          } flex justify-center`}
        >
          <div className="relative w-full max-w-[500px] mx-auto">
            <div className="aspect-[3/4]">
              <Image
                src={yourNeedsImage}
                alt="Eshtarena App Screenshots"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 