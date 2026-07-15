import React from "react";
import Image from "next/image";
import { DealImage } from "../../types/deals";
import ImageCarousel from "./ImageCarousel";

interface DealGalleryProps {
  images: DealImage[];
  className?: string;
}

export default function DealGallery({ images, className = "" }: DealGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div
        className={`aspect-square rounded-2xl bg-gray-100 flex items-center justify-center ${className}`}
      >
        <span className="text-sm text-gray-400">No image available</span>
      </div>
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
