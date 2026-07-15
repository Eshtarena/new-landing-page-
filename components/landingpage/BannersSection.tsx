import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next/pages";
import { SLIDER_IMAGES } from "../../utils/consts";
import { useSwipeable } from "react-swipeable";

export default function BannersSection() {
  const { t, i18n } = useTranslation("common");
  const [slide, setSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const images = i18n.language === "ar" ? SLIDER_IMAGES.ar : SLIDER_IMAGES.en;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset errors and loading state when language changes
  const [prevLanguage, setPrevLanguage] = useState(i18n.language);
  if (i18n.language !== prevLanguage) {
    setPrevLanguage(i18n.language);
    setImageErrors({});
    setIsLoading(true);
    setSlide(1); // Reset slide position when language changes
  }

  // Filter out images that failed to load
  const validImages = images.filter((img, index) => !imageErrors[index]);

  // Create array with cloned images for infinite effect
  const extendedImages = [
    validImages[validImages.length - 1],
    ...validImages,
    validImages[0],
  ];

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleTransitionEnd = () => {
    if (isTransitioning) {
      setIsTransitioning(false);
      if (slide >= validImages.length + 1) {
        setSlide(1);
      } else if (slide === 0) {
        setSlide(validImages.length);
      }
    }
  };

  const isRTL = i18n.language === "ar";

  const pauseAutoplay = useCallback(() => {
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  }, []);

  const nextSlide = useCallback(() => {
    if (validImages.length <= 1) return;
    setIsTransitioning(true);
    setSlide((prev) => prev + 1);
  }, [validImages.length]);

  const prevSlide = useCallback(() => {
    if (validImages.length <= 1) return;
    setIsTransitioning(true);
    setSlide((prev) => prev - 1);
  }, [validImages.length]);

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (validImages.length <= 1) return;
      const currentIndex =
        slide === 0
          ? validImages.length - 1
          : slide === validImages.length + 1
          ? 0
          : slide - 1;
      if (targetIndex === currentIndex) return;
      setIsTransitioning(true);
      setSlide(targetIndex + 1);
      pauseAutoplay();
    },
    [validImages.length, slide, pauseAutoplay]
  );

  useEffect(() => {
    if (validImages.length === 0 || !isAutoplay) return;

    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 3000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slide, validImages.length, isAutoplay, nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isRTL) {
        prevSlide();
      } else {
        nextSlide();
      }
      pauseAutoplay();
    },
    onSwipedRight: () => {
      if (isRTL) {
        nextSlide();
      } else {
        prevSlide();
      }
      pauseAutoplay();
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  if (validImages.length === 0) {
    return (
      <section
        id="home"
        className="w-full bg-gray-200 text-center relative rounded-b-[2.5rem] md:rounded-b-[3rem] overflow-hidden pt-16 md:pt-20"
      >
        <div className="w-full aspect-banner flex items-center justify-center">
          <div className="text-gray-600 text-xl px-4">
            {isLoading
              ? "Loading banners..."
              : "Banner images will appear here once uploaded"}
          </div>
        </div>
      </section>
    );
  }

  const getSliderStyle = () => ({
    transform: `translateX(-${slide * 100}%)`,
    transition: isTransitioning
      ? "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)"
      : "none",
    willChange: isTransitioning ? "transform" : "auto",
  });

  // Normalize the extended-slider index (with clones) back to a real slide index
  const activeIndex =
    slide === 0
      ? validImages.length - 1
      : slide === validImages.length + 1
      ? 0
      : slide - 1;

  return (
    <section
      id="home"
      className={`w-full text-center relative pb-12 md:pb-14 ${
        i18n.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="relative">
      <div
        className="w-full max-w-full mx-auto relative overflow-hidden rounded-b-3xl md:rounded-b-[3rem] aspect-banner shadow-soft-lg bg-[#340040] touch-pan-y select-none"
        {...handlers}
      >
        <div
          dir="ltr"
          className="flex h-full"
          style={getSliderStyle()}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className="w-full flex-shrink-0 h-full relative"
            >
              <Image
                src={img}
                alt={`Slider image ${idx + 1}`}
                fill
                draggable={false}
                className="object-cover w-full h-full pointer-events-none"
                priority={idx === 1}
                loading={idx === 1 ? "eager" : "lazy"}
                sizes="100vw"
                onError={() => handleImageError(images.indexOf(img))}
                onLoad={handleImageLoad}
                quality={100}
              />
            </div>
          ))}
        </div>

        {/* Top scrim: keeps the floating glass navbar legible over bright banners */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 md:h-44 bg-gradient-to-b from-primary-900/80 via-primary-900/40 to-transparent z-10" />

        {/* Bottom scrim: soft depth behind the curve and floating CTA */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#17001d]/40 to-transparent z-10" />
      </div>

      {/* Slide indicators — below banner on mobile so they don't cover artwork */}
      {validImages.length > 1 && (
        <div
          className="flex justify-center gap-2 mt-3 md:mt-0 md:absolute md:inset-x-0 md:bottom-10 md:z-20"
          role="tablist"
          aria-label="Banner slides"
        >
          {validImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              role="tab"
              className={`h-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer min-w-3 min-h-3 ${
                i === activeIndex
                  ? "w-6 bg-primary-500 md:bg-white"
                  : "w-1.5 bg-primary-500/25 hover:bg-primary-500/40 md:bg-white/50 md:hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
      </div>

      {/* Floating CTA: overlaps the hero's bottom edge into the next section */}
      <div className="absolute inset-x-0 -bottom-5 sm:-bottom-7 flex justify-center z-20 px-4">
        <Link
          href="/egy"
          className="group inline-flex items-center gap-2 bg-[#340040] text-white font-semibold text-sm sm:text-base md:text-lg px-6 sm:px-10 py-3 sm:py-4 min-h-11 rounded-full shadow-[0_8px_32px_rgba(52,0,64,0.24)] ring-2 sm:ring-4 ring-white hover:-translate-y-0.5 hover:bg-[#4a0059] transition-all duration-300 ease-spring"
        >
          {t("navbar.shopNow")}
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}