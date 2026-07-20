import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';
import { STORES_IMAGES_LINKS } from '../../../utils/consts';

export default function HeroSection() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isArabic = i18n.language === 'ar';

  return (
    <section className="relative min-h-screen bg-[#340040] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={isArabic ? "/banners/arabic/best_price_ar.png" : "/banners/english/best_price_en.png"}
          alt="Hero Background"
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
          priority
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              {/* App Store Button */}
              <a
                href="#"
                className="w-[160px] h-[48px] relative transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={isArabic ? STORES_IMAGES_LINKS.ar.apple : STORES_IMAGES_LINKS.en.apple}
                  alt="App Store"
                  fill
                  className="object-contain"
                />
              </a>
              
              {/* Google Play Button */}
              <a
                href="#"
                className="w-[160px] h-[48px] relative transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={isArabic ? STORES_IMAGES_LINKS.ar.google : STORES_IMAGES_LINKS.en.google}
                  alt="Google Play"
                  fill
                  className="object-contain"
                />
              </a>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px]">
            <Image
              src={isArabic ? "/banners/arabic/phones_ar.png" : "/banners/english/phones_en.png"}
              alt="App Preview"
              fill
              style={{ objectFit: 'contain' }}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 