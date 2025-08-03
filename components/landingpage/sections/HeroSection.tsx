import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function HeroSection() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isArabic = router.locale === 'ar';

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
            <div className="flex flex-col sm:flex-row gap-4">
              {/* App Store Button */}
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#340040] bg-white hover:bg-white/90 md:text-lg"
              >
                <Image
                  src="/apple_store.svg"
                  alt="App Store"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                App Store
              </a>
              
              {/* Google Play Button */}
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 md:text-lg"
              >
                <Image
                  src="/google_play.svg"
                  alt="Google Play"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Google Play
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