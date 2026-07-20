import { useTranslation } from "next-i18next/pages";
import DealCard from "../DealCard";
import { DEALS_DATA } from "../../utils/consts";

export default function DealsSection() {
  const { t, i18n } = useTranslation("common");

  const getImageSrc = (imageSrc) => {
    if (typeof imageSrc === "string") return imageSrc;
    return i18n.language === "ar" ? imageSrc.ar : imageSrc.en;
  };

  const getCardContent = (deal) => {
    const baseKey = deal.translationKey;
    return {
      title: t(`${baseKey}.title`),
      description:
        deal.id === "howToUse"
          ? ""
          : t(`${baseKey}.description`, { returnNull: true }),
      points: (() => {
        // For deals with numbered points
        if (deal.id === "original") {
          return [1, 2, 3, 4]
            .map((num) => {
              const point = t(`${baseKey}.point${num}`, { returnNull: true });
              return point || null;
            })
            .filter(Boolean);
        }
        // For voucher deal
        if (deal.id === "voucher") {
          return [1, 2]
            .map((num) => {
              const point = t(`${baseKey}.point${num}`, { returnNull: true });
              return point || null;
            })
            .filter(Boolean);
        }
        // For how to use section
        if (deal.id === "howToUse") {
          return [1, 2, 3, 4].map((num) => t(`${baseKey}.point${num}`));
        }
        // For cold deal
        if (deal.id === "cold") {
          return [t(`${baseKey}.refundPolicy`)];
        }
        return [];
      })(),
    };
  };

  return (
    <section id="deals" className={`w-full ${i18n.language === "ar" ? "rtl" : "ltr"}`}>
      <div className="text-center mb-6 sm:mb-8 md:mb-10 pt-6 sm:pt-8 md:pt-12 px-4 sm:px-6 lg:px-24">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 leading-tight bg-linear-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent w-fit mx-auto">
          {t("deals.title")}
        </h2>
        <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto px-2">
          {t("deals.description")}
        </p>
      </div>

      <div className="flex flex-col items-center">
        {DEALS_DATA.map((deal, index) => {
          const { title, description, points } = getCardContent(deal);
          return (
            <DealCard
              key={deal.id}
              title={title}
              description={description}
              points={points}
              imageSrc={getImageSrc(deal.imageSrc)}
              imageAlt={deal.imageAlt}
              imageIsPhone={deal.imageIsPhone}
              isReversed={index % 2 === 1}
              hasBgColor={deal.hasBgColor}
            />
          );
        })}
      </div>
    </section>
  );
} 