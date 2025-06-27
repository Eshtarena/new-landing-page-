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
  const [slide, setSlide] = useState(1); // Start at 1 because we add a clone at the beginning
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [isAutoplay, setIsAutoplay] = useState(true);
  const images = i18n.language === 'ar' ? SLIDER_IMAGES.ar : SLIDER_IMAGES.en;
  const timeoutRef = useRef();
  const transitionRef = useRef();

  // Filter out images that failed to load
  const validImages = images.filter((img, index) => !imageErrors[index]);

  // Create array with cloned images for infinite effect
  const extendedImages = [
    validImages[validImages.length - 1], // Clone last image at start
    ...validImages,
    validImages[0] // Clone first image at end
  ];

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
    setIsTransitioning(true);
    setSlide(prev => prev + 1);
  };

  const prevSlide = () => {
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

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  if (validImages.length === 0) {
    return (
      <section id="home" className="w-full bg-gray-200 text-center relative mt-[65px] md:mt-[90px]">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-gray-600 text-xl px-4">
            Banner images will appear here once uploaded
          </div>
        </div>
      </section>
    );
  }

  const getSliderStyle = () => {
    return {
      transform: `translateX(-${slide * 100}%)`,
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
                alt="slider" 
                fill 
                className="object-contain md:object-cover w-full h-full" 
                priority={idx <= 1} // Prioritize loading of first two images
                sizes="100vw"
                onError={() => handleImageError(images.indexOf(img))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 