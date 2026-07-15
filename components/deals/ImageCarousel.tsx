import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

  if (images.length === 0) {
    return (
      <div className={`${aspectRatioClasses[aspectRatio]} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  // Check if className contains height classes (h-*), if so, skip aspect ratio
  const hasFixedHeight = className.includes('h-');
  const containerClasses = hasFixedHeight
    ? 'relative w-full h-full rounded-lg overflow-hidden bg-gray-100'
    : `relative ${aspectRatioClasses[aspectRatio]} rounded-lg overflow-hidden bg-gray-100`;

  return (
    <div className={`relative ${className}`}>
      <div className={containerClasses}>
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-300"
          loading="lazy"
        />
        
        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-soft backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
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
              onClick={() => goToSlide(index)}
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
      {images.length > 1 && (
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