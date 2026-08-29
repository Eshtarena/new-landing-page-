import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';
import { useBanners } from '../../hooks/useBanners';
import { normalizeBannerImageUrl } from '../../services/banners.service';

interface Slide {
  id: string | number;
  image: {
    en: string;
    ar: string;
  };
  /** Mobile-breakpoint image; null falls back to `image[lang]`. */
  mobileImage: string | null;
  title: string;
  link: string;
}

const FALLBACK_SLIDES = [
  { id: 1, image: { en: '/banners/english/1.webp', ar: '/banners/arabic/1.webp' }, titleKey: 'navbar.shopNow' },
  { id: 2, image: { en: '/banners/english/2.webp', ar: '/banners/arabic/2.webp' }, titleKey: 'deals.title' },
  { id: 3, image: { en: '/banners/english/3.webp', ar: '/banners/arabic/3.webp' }, titleKey: 'about.mainTitleLine1' }
];

export default function HeroSlider() {
  const { t, i18n } = useTranslation('common');
  const [slide, setSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const lang = (i18n.language || 'en') as 'en' | 'ar';
  const isRTL = lang === 'ar';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { banners, isLoading, error } = useBanners();

  const usingFallback = !isLoading && (error !== null || banners.length === 0);
  const slides: Slide[] = usingFallback
    ? FALLBACK_SLIDES.map((item) => ({ ...item, mobileImage: null, title: t(item.titleKey), link: '#' }))
    : banners.map((banner) => ({
        id: banner.id,
        image: { en: banner.imageUrl_en, ar: banner.imageUrl_ar },
        mobileImage: normalizeBannerImageUrl(banner.mobileImageUrl),
        title: (lang === 'ar' ? banner.title_ar : banner.title_en) || t('navbar.shopNow'),
        link: banner.linkUrl
      }));

  const extendedSlides =
    slides.length > 1
      ? [slides[slides.length - 1], ...slides, slides[0]]
      : slides;

  useEffect(() => {
    // Infinite carousel uses index 1 (clone prefix); a single slide must stay at 0.
    setSlide(slides.length <= 1 ? 0 : 1);
    setIsTransitioning(false);
  }, [slides.length, lang]);

  const pauseAutoplay = useCallback(() => {
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setSlide((prev) => prev + 1);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setSlide((prev) => prev - 1);
  }, [slides.length]);

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (slides.length <= 1) return;
      const currentIndex =
        slide === 0
          ? slides.length - 1
          : slide === slides.length + 1
          ? 0
          : slide - 1;
      if (targetIndex === currentIndex) return;
      setIsTransitioning(true);
      setSlide(targetIndex + 1);
      pauseAutoplay();
    },
    [slides.length, slide, pauseAutoplay]
  );

  const handleTransitionEnd = () => {
    if (!isTransitioning) return;
    setIsTransitioning(false);
    if (slide >= slides.length + 1) {
      setSlide(1);
    } else if (slide === 0) {
      setSlide(slides.length);
    }
  };

  useEffect(() => {
    if (slides.length < 2 || !isAutoplay) return;

    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slide, slides.length, isAutoplay, nextSlide]);

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

  const activeIndex =
    slide === 0
      ? slides.length - 1
      : slide === slides.length + 1
      ? 0
      : slide - 1;

  const carouselIndex = slides.length <= 1 ? 0 : slide;

  const getSliderStyle = () => ({
    transform: `translateX(-${carouselIndex * 100}%)`,
    transition: isTransitioning
      ? 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none',
    willChange: isTransitioning ? 'transform' : 'auto',
  });

  if (isLoading) {
    return (
      <div className="relative w-full aspect-banner rounded-2xl sm:rounded-3xl md:rounded-4xl overflow-hidden my-3 sm:my-4 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3 shadow-soft-lg bg-gray-200 animate-pulse" />
    );
  }

  return (
    <div className="relative my-3 sm:my-4 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
      <div
        className="relative w-full aspect-banner rounded-2xl sm:rounded-3xl md:rounded-4xl overflow-hidden shadow-soft-lg bg-primary-500 touch-pan-y select-none"
        {...handlers}
      >
        <div
          dir="ltr"
          className="flex h-full"
          style={getSliderStyle()}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((item, index) => (
            <div key={`${item.id}-${index}`} className="relative h-full w-full shrink-0">
              {/* next/image has no <picture>/<source> support, so art direction (distinct
                  mobile vs desktop crops) is done with two Image elements swapped by breakpoint. */}
              {item.mobileImage ? (
                <Image
                  src={item.mobileImage}
                  alt={item.title}
                  fill
                  draggable={false}
                  className="object-cover object-center w-full h-full pointer-events-none md:hidden"
                  priority={index === 1}
                  loading={index === 1 ? 'eager' : 'lazy'}
                  sizes="100vw"
                />
              ) : null}
              <Image
                src={item.image[lang]}
                alt={item.title}
                fill
                draggable={false}
                className={`w-full h-full pointer-events-none ${
                  item.mobileImage
                    ? 'hidden md:block object-cover object-center'
                    : 'object-contain object-center md:object-cover'
                }`}
                priority={index === 1}
                loading={index === 1 ? 'eager' : 'lazy'}
                sizes={item.mobileImage ? '1600px' : '(max-width: 768px) 100vw, 1600px'}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
              <div
                className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-12 z-10 flex ${
                  isRTL ? 'justify-end text-right' : 'justify-start text-left'
                }`}
              >
                {item.link && item.link !== '#' ? (
                  <Link href={item.link} className="block max-w-xl">
                    <h2 className="text-lg sm:text-2xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                      {item.title}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="text-lg sm:text-2xl md:text-5xl font-bold tracking-tight text-white max-w-xl leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                    {item.title}
                  </h2>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 bg-linear-to-t from-primary-800/40 to-transparent z-10" />
      </div>

      {/* Slide indicators — below banner on mobile so they don't cover artwork */}
      {slides.length > 1 && (
        <div
          className="flex justify-center gap-1 mt-2 md:mt-0 md:absolute md:inset-x-0 md:bottom-8 md:z-20"
          role="tablist"
          aria-label="Banner slides"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              role="tab"
              className={`w-2 h-2 rounded-full transition-colors duration-300 ease-out cursor-pointer ${
                index === activeIndex
                  ? 'bg-primary-500 md:bg-white'
                  : 'bg-primary-500/25 hover:bg-primary-500/40 md:bg-white/50 md:hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
