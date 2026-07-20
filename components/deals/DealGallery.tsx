import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { DealImage } from "../../types/deals";
import ImageCarousel from "./ImageCarousel";

interface DealGalleryProps {
  images: DealImage[];
  className?: string;
  variant?: "default" | "hero";
}

export default function DealGallery({
  images,
  className = "",
  variant = "default",
}: DealGalleryProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const hasMultiple = images.length > 1;
  const isHero = variant === "hero";
  const queryLang = Array.isArray(router.query.lang) ? router.query.lang[0] : router.query.lang;
  const isRTL = queryLang === "ar";
  const backIconPath = isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7";

  if (images.length === 0) {
    return (
      <div
        className={`aspect-square rounded-2xl bg-gray-100 flex items-center justify-center ${className}`}
      >
        <span className="text-sm text-gray-400">No image available</span>
      </div>
    );
  }

  if (isHero) {
    return (
      <>
        <div className={`relative w-full ${className}`}>
          <ImageCarousel
            images={images}
            autoScroll={false}
            showDots={false}
            showArrows={false}
            aspectRatio="square"
            currentIndex={activeIndex}
            onIndexChange={setActiveIndex}
            overlayControls
            onBack={() => router.back()}
            onExpand={() => setIsFullscreen(true)}
            backIconPath={backIconPath}
            className="w-full"
          />
        </div>

        {isFullscreen ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 end-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="Close preview"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative h-full w-full max-h-screen max-w-screen">
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-soft border border-black/5">
        <ImageCarousel
          images={images}
          autoScroll={false}
          showDots={hasMultiple}
          showArrows={hasMultiple}
          aspectRatio="square"
          currentIndex={activeIndex}
          onIndexChange={setActiveIndex}
          className="w-full"
        />
      </div>

      {hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ease-spring ${
                index === activeIndex
                  ? "border-primary-500 shadow-soft"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
