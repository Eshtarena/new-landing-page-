import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { SLIDER_IMAGES } from '../utils/consts';
import { useSwipeable } from 'react-swipeable';

// Navbar heights
const NAVBAR_HEIGHT_MOBILE = "70px";  // Height of the logo in mobile
const NAVBAR_HEIGHT_DESKTOP = "90px";  // Height used in scroll calculations

export default function BannersSection() {
  const { i18n } = useTranslation('common');
  const [slide, setSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const images = i18n.language === 'ar' ? SLIDER_IMAGES.ar : SLIDER_IMAGES.en;
  const timeoutRef = useRef();

  useEffect(() => {
    // Reset errors and loading state when language changes
    setImageErrors({});
    setIsLoading(true);
  }, [i18n.language]);

  // Filter out images that failed to load
  const validImages = images.filter((img, index) => !imageErrors[index]);

  // Create array with cloned images for infinite effect
  const extendedImages = [
    validImages[validImages.length - 1],
    ...validImages,
    validImages[0]
  ];

  const handleImageError = (index, error) => {
    console.error(`Error loading image at index ${index}:`, error);
    console.log('Image path:', images[index]);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index) => {
    console.log('Image loaded successfully:', images[index]);
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

  const nextSlide = () => {
    if (validImages.length <= 1) return;
    setIsTransitioning(true);
    setSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (validImages.length <= 1) return;
    setIsTransitioning(true);
    setSlide(prev => prev - 1);
  };

  useEffect(() => {
    if (validImages.length === 0 || !isAutoplay) return;
    
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [slide, validImages.length, isAutoplay]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      nextSlide();
      setIsAutoplay(false);
      setTimeout(() => setIsAutoplay(true), 5000);
    },
    onSwipedRight: () => {
      prevSlide();
      setIsAutoplay(false);
      setTimeout(() => setIsAutoplay(true), 5000);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (validImages.length === 0) {
    return (
      <section id="home" className="w-full bg-gray-200 text-center relative mt-[70px] md:mt-[90px]">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-gray-600 text-xl px-4">
            {isLoading ? 'Loading banners...' : 'Banner images will appear here once uploaded'}
          </div>
        </div>
      </section>
    );
  }

  const getSliderStyle = () => {
    return {
      transform: `translateX(${i18n.language === 'ar' ? '' : '-'}${slide * 100}%)`,
      transition: isTransitioning ? 'transform 700ms ease-in-out' : 'none'
    };
  };

  return (
    <section id="home" className="w-full text-center relative mt-[44px] md:mt-[90px]">
      <div 
        className="w-full max-w-full mx-auto relative overflow-hidden md:h-screen h-auto aspect-[4/3]"
        {...handlers}
      >
        <div 
          className="flex h-full"
          style={getSliderStyle()}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.map((img, idx) => (
            <div key={`${img}-${idx}`} className="w-full flex-shrink-0 h-full relative flex items-center justify-center">
              <Image 
                src={img} 
                alt={`Slider image ${idx + 1}`}
                fill 
                className="object-contain md:object-cover w-full h-full" 
                priority={idx <= 1}
                sizes="100vw"
                onError={(error) => handleImageError(images.indexOf(img), error)}
                onLoad={() => handleImageLoad(images.indexOf(img))}
                quality={100}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 