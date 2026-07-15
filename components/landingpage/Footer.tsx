import { useTranslation } from "next-i18next/pages";
import Image from "next/image";
import Link from "next/link";
import { STORES_IMAGES_LINKS } from "../../utils/consts";

export default function Footer({ socialData }) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  return (
    <footer className={`bg-[#340040] text-white py-10 sm:py-12 px-4 sm:px-6 md:px-12 ${
      isRTL ? "rtl" : "ltr"
    }`}>
      <div className={`container-width ${isRTL ? "rtl" : "ltr"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* First Column - Logo and Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-4 sm:space-y-6">
            <Link href="/" className="w-[200px] h-[80px] sm:w-[250px] sm:h-[100px] md:w-[300px] md:h-[120px] relative">
              <Image
                src="/Group.svg"
                alt="Eshtarena"
                fill
                priority
                className="object-contain brightness-0 invert"
              />
            </Link>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {Array.isArray(socialData?.social) &&
                socialData.social.map((social) => (
                  <a
                    key={social._id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 relative rounded-full hover:bg-white/10 hover:opacity-90 transition-all duration-200 ease-spring"
                  >
                    <Image
                      src={social.logo}
                      alt={social.title}
                      fill
                      className="object-contain p-1.5"
                    />
                  </a>
                ))}
            </div>
          </div>

          {/* Second Column - Links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="text-lg font-semibold mb-2">{t("footer.links")}</h3>
            <Link
              href="/terms-and-conditions"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors text-center md:text-start"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="/privacy-policy"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors text-center md:text-start"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/advice"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors text-center md:text-start"
            >
              {t("footer.advice")}
            </Link>
          </div>

          {/* Third Column - Download App */}
          <div className="flex flex-col text-center items-center md:items-start space-y-6">
            <p className="text-lg font-semibold text-center">
              {t("footer.downloadApp")}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              {socialData.apple && (
                <Link
                  href={socialData.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-[36px] relative"
                >
                  <Image
                    src={isRTL ? STORES_IMAGES_LINKS.ar.apple : STORES_IMAGES_LINKS.en.apple}
                    alt="Download on App Store"
                    fill
                    className="object-contain"
                  />
                </Link>
              )}
              {socialData.google && (
                <Link
                  href={socialData.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-[36px] relative"
                >
                  <Image
                    src={isRTL ? STORES_IMAGES_LINKS.ar.google : STORES_IMAGES_LINKS.en.google}
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                  />
                </Link>
              )}
            </div>
            <p className="text-sm opacity-80 text-center md:text-start">
              © {new Date().getFullYear()} All rights reserved by Eshtrayna L.T.D IBC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 