import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import { DealImage } from '../../types/deals';

interface ImageCarouselProps {
  images: DealImage[];
  className?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide';
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  overlayControls?: boolean;
  onBack?: () => void;
  onExpand?: () => void;
  backIconPath?: string;
}

export default function ImageCarousel({
  images,
  className = '',
  autoScroll = true,
  autoScrollInterval = 3000,
  showDots = true,
  showArrows = false,
  aspectRatio = 'video',
  currentIndex: controlledIndex,
  onIndexChange,
  overlayControls = false,
  onBack,
  onExpand,
  backIconPath = 'M15 19l-7-7 7-7',
}: ImageCarouselProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : uncontrolledIndex;

  const setCurrentIndex = (index: number) => {
    if (!isControlled) {
      setUncontrolledIndex(index);
    }
    onIndexChange?.(index);
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]'
  };

  useEffect(() => {
    if (!autoScroll || images.length <= 1 || isControlled) return;

    const interval = setInterval(() => {
      setUncontrolledIndex((prev) => (prev + 1) % images.length);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, images.length, isControlled]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Mirrors HeroSlider's swipe setup: touch-pan-y + preventScrollOnSwipe lets
  // react-swipeable claim only confirmed horizontal drags, so vertical page
  // scroll through the card/gallery is never blocked.
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (images.length > 1) goToNext();
    },
    onSwipedRight: () => {
      if (images.length > 1) goToPrevious();
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  if (images.length === 0) {
    return (
      <div className={`${aspectRatioClasses[aspectRatio]} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  // Check if className contains height classes (h-*), if so, skip aspect ratio
  const hasFixedHeight = className.includes('h-');
  const roundedClass = overlayControls ? 'rounded-none' : 'rounded-lg';
  const containerClasses = hasFixedHeight
    ? `relative w-full h-full ${roundedClass} overflow-hidden bg-gray-100`
    : `relative ${aspectRatioClasses[aspectRatio]} ${roundedClass} overflow-hidden bg-gray-100`;

  const overlayButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white';

  return (
    <div className={`relative ${className}`}>
      <div className={`${containerClasses} touch-pan-y select-none`} {...swipeHandlers}>
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-300 pointer-events-none"
          loading="lazy"
        />

        {overlayControls ? (
          <>
            {onBack ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                className={`absolute start-3 top-3 z-10 ${overlayButtonClass}`}
                aria-label="Go back"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={backIconPath} />
                </svg>
              </button>
            ) : null}

            <div className="absolute bottom-3 start-3 z-10 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
              {currentIndex + 1}/{images.length}
            </div>

            {onExpand ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className={`absolute bottom-3 end-3 z-10 ${overlayButtonClass}`}
                aria-label="Expand image"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            ) : null}
          </>
        ) : null}

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && !overlayControls && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-soft backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-soft backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-gray-800'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && !overlayControls && (
        <div className="absolute top-3 end-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// Compact version for smaller cards
export function CompactImageCarousel({
  images,
  className = '',
  aspectRatio = 'square'
}: Pick<ImageCarouselProps, 'images' | 'className' | 'aspectRatio'>) {
  return (
    <ImageCarousel
      images={images}
      className={className}
      autoScroll={true}
      autoScrollInterval={4000}
      showDots={false}
      showArrows={false}
      aspectRatio={aspectRatio}
    />
  );
} 