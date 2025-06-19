import { useTranslation } from "next-i18next";
import DealCard from '../components/DealCard';
import { DEALS_DATA } from '../utils/consts';

export default function DealsSection() {
  const { t, i18n } = useTranslation("common");
  
  const getImageSrc = (imageSrc) => {
    if (typeof imageSrc === 'string') return imageSrc;
    return i18n.language === 'ar' ? imageSrc.ar : imageSrc.en;
  };

  const getCardContent = (deal) => {
    const baseKey = deal.translationKey;
    return {
      title: t(`${baseKey}.title`),
      description: t(`${baseKey}.description`, { returnNull: true }),
      points: (() => {
        // For deals with numbered points
        if (['original', 'voucher'].includes(deal.id)) {
          return [1, 2, 3, 4].map(num => {
            const point = t(`${baseKey}.point${num}`, { returnNull: true });
            return point || null;
          }).filter(Boolean);
        }
        // For how to use section
        if (deal.id === 'howToUse') {
          return [1, 2, 3, 4].map(num => t(`${baseKey}.point${num}`));
        }
        // For cold deal
        if (deal.id === 'cold') {
          return [t(`${baseKey}.refundPolicy`)];
        }
        return [];
      })()
    };
  };

  return (
    <section id="deals" className="w-full">
      <div className="container-width text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#340040] mb-6">
          {t('deals.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('deals.description')}
        </p>
      </div>

      {DEALS_DATA.map((deal) => {
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
            isReversed={deal.isReversed}
            hasBgColor={deal.hasBgColor}
          />
        );
      })}
    </section>
  );
}
