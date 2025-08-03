import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Step {
  id: number;
  title: string;
  description: string;
  image: {
    ar: string;
    en: string;
  };
}

export default function HowItWorksSection() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isArabic = router.locale === 'ar';

  const steps: Step[] = [
    {
      id: 1,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      image: {
        ar: '/landing_page/arabic/step1_ar.png',
        en: '/landing_page/english/step1_en.png'
      }
    },
    {
      id: 2,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      image: {
        ar: '/landing_page/arabic/step2_ar.png',
        en: '/landing_page/english/step2_en.png'
      }
    },
    {
      id: 3,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      image: {
        ar: '/landing_page/arabic/step3_ar.png',
        en: '/landing_page/english/step3_en.png'
      }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#340040] mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid gap-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:pl-12' : 'md:pr-12'}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#340040] text-white flex items-center justify-center font-bold text-xl">
                    {step.id}
                  </div>
                  <div className="h-px flex-1 bg-[#340040] ml-4" />
                </div>
                <h3 className="text-2xl font-bold text-[#340040] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {step.description}
                </p>
              </div>
              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src={isArabic ? step.image.ar : step.image.en}
                  alt={step.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 