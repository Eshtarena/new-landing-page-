import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { SLIDER_IMAGES } from '../utils/consts';

// Navbar heights
const NAVBAR_HEIGHT_MOBILE = "70px";  // Height of the logo in mobile
const NAVBAR_HEIGHT_DESKTOP = "90px";  // Height used in scroll calculations

export default function BannersSection() {
  const { i18n } = useTranslation('common');
  const [slide, setSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const images = i18n.language === 'ar' ? SLIDER_IMAGES.ar : SLIDER_IMAGES.en;
  const timeoutRef = useRef();

  // Filter out images that failed to load
  const validImages = images.filter((img, index) => !imageErrors[index]);

  useEffect(() => {
    if (validImages.length === 0) return;
    
    timeoutRef.current = setTimeout(() => {
      setSlide((prev) => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [slide, validImages.length]);

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  if (validImages.length === 0) {
    return (
      <section id="home" className="w-full bg-gray-200 text-center relative mt-[70px] md:mt-[90px]">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="text-gray-600 text-xl px-4">
            Banner images will appear here once uploaded
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="w-full bg-gray-50 text-center relative mt-[45px] md:mt-[90px]">
      <div className="w-full max-w-full mx-auto relative overflow-hidden md:h-screen h-auto aspect-[4/3]">
        <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {validImages.map((img, idx) => (
            <div key={img} className="w-full flex-shrink-0 h-full relative flex items-center justify-center">
              <Image 
                src={img} 
                alt="slider" 
                fill 
                className="object-contain md:object-cover w-full h-full" 
                priority={idx === 0}
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