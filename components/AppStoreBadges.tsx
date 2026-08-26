import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import { STORES_IMAGES_LINKS } from "../utils/consts";
import { GOOGLE_PLAY_URL } from "../utils/appStore";
import ComingSoonModal from "./ComingSoonModal";

interface AppStoreBadgesProps {
  containerClassName?: string;
  badgeClassName?: string;
  showApple?: boolean;
  showGoogle?: boolean;
}

export default function AppStoreBadges({
  containerClassName = "flex flex-wrap gap-4 items-center justify-center md:justify-start",
  badgeClassName = "w-[140px] h-[42px] relative block rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
  showApple = true,
  showGoogle = true,
}: AppStoreBadgesProps) {
  const { i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div className={containerClassName}>
        {showApple && (
          <button
            type="button"
            onClick={() => setShowComingSoon(true)}
            className={`${badgeClassName} cursor-pointer border-0 bg-transparent p-0`}
            aria-label="Download on the App Store"
          >
            <Image
              src={isRTL ? STORES_IMAGES_LINKS.ar.apple : STORES_IMAGES_LINKS.en.apple}
              alt="Download on the App Store"
              fill
              className="object-contain"
            />
          </button>
        )}
        {showGoogle && (
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={badgeClassName}
          >
            <Image
              src={isRTL ? STORES_IMAGES_LINKS.ar.google : STORES_IMAGES_LINKS.en.google}
              alt="Get it on Google Play"
              fill
              className="object-contain"
            />
          </a>
        )}
      </div>

      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
}
