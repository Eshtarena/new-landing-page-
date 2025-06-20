import Image from 'next/image';
import { useTranslation } from 'next-i18next';

export default function DealCard({ 
  title, 
  description, 
  points, 
  imageSrc, 
  imageAlt,
  imageIsPhone, // special case for phone image with different dimensions
  isReversed, // if true, image will be on the left (or right in RTL)
  hasBgColor = false // if true, card will have light purple background
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const ContentSection = () => (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#340040] mb-6 text-center lg:text-start">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 mb-8 text-center lg:text-start">
          {description}
        </p>
      )}
      {points && points.length > 0 && (
        <ul className="space-y-6">
          {points.map((point, index) => (
            <li key={index} className="flex items-start text-lg text-gray-600">
              <span className={`w-2 h-2 mt-2.5 rounded-full bg-[#340040] flex-shrink-0 ${isRTL ? 'ml-4' : 'mr-4'}`}></span>
              <p className="text-center lg:text-start flex-grow">{point}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="flex items-center justify-center">
      <div className={imageIsPhone ? "w-[300px] h-[600px] relative" : "w-full max-w-2xl"}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          {...(imageIsPhone 
            ? { fill: true, className: "object-contain" }
            : { width: 800, height: 600, className: "w-full h-auto rounded-lg" }
          )}
        />
      </div>
    </div>
  );

  // Determine the order based on RTL and isReversed
  const shouldReverse = isRTL ? !isReversed : isReversed;

  return (
    <div className={`w-full ${hasBgColor ? 'bg-[#F0F0F5]' : ''}`}>
      <div className="py-16">
        <div className="container-width">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ${isRTL ? 'rtl' : 'ltr'}`}>
            {shouldReverse ? (
              <>
                <ImageSection />
                <ContentSection />
              </>
            ) : (
              <>
                <ContentSection />
                <ImageSection />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 