import Image from "next/image";
import { useTranslation } from "next-i18next/pages";

interface DealCardProps {
  title: string;
  description?: string | null;
  points?: string[];
  imageSrc: string;
  imageAlt: string;
  imageIsPhone?: boolean; // special case for phone image with different dimensions
  isReversed?: boolean; // if true, image appears on the right (left in RTL)
  hasBgColor?: boolean; // if true, card will have light purple background
}

export default function DealCard({
  title,
  description,
  points,
  imageSrc,
  imageAlt,
  imageIsPhone,
  isReversed = false,
  hasBgColor = false,
}: DealCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const contentSection = (
    <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6 leading-tight text-center lg:text-start">
        {title}
      </h2>
      {description && (
        <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-4 sm:mb-6 text-center lg:text-start">
          {description}
        </p>
      )}
      {points && points.length > 0 && (
        <ul className="space-y-4">
          {points.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-lg font-light text-slate-600 leading-relaxed"
            >
              <svg
                className="w-6 h-6 mt-0.5 text-primary-500 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-start flex-grow">{point}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imageSection = (
    <div className="flex items-center justify-center">
      <div
        className={`relative isolate ${
          imageIsPhone
            ? "w-[220px] h-[360px] sm:w-[280px] sm:h-[440px] md:w-[350px] md:h-[550px]"
            : "w-full max-w-lg sm:max-w-xl md:max-w-2xl"
        }`}
      >
        {/* Decorative glow behind the visual */}
        <div
          aria-hidden="true"
          className="absolute w-[115%] h-[115%] left-[-7.5%] top-[-7.5%] bg-linear-to-tr from-primary-500/20 via-purple-500/15 to-transparent blur-3xl rounded-full -z-10"
        />
        <Image
          src={imageSrc}
          alt={imageAlt}
          {...(imageIsPhone
            ? { fill: true, className: "object-contain drop-shadow-2xl" }
            : {
                width: 800,
                height: 600,
                className: "w-full h-auto rounded-2xl object-cover drop-shadow-xl",
              })}
        />
      </div>
    </div>
  );

  const shouldReverse = isReversed;

  const cardClassName = `w-full px-4 sm:px-6 lg:px-8 xl:px-24 ${
    hasBgColor ? "bg-slate-50" : ""
  }`;

  const content = (
    <div className="py-8 md:py-10">
      <div className="container-width">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center ${
            isRTL ? "rtl" : "ltr"
          }`}
        >
          {shouldReverse ? (
            <>
              {contentSection}
              {imageSection}
            </>
          ) : (
            <>
              {imageSection}
              {contentSection}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return <div className={cardClassName}>{content}</div>;
}
