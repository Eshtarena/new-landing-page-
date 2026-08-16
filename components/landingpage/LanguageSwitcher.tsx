import React from 'react';
import { useRouter } from 'next/router';
import { beginLocaleSwitch } from '../../utils/localeSwitch';

function GlobeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'segmented';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguage = async (locale: string): Promise<void> => {
    if (router.locale === locale) {
      return;
    }

    beginLocaleSwitch();

    await router.push({ pathname, query }, asPath, { locale, scroll: false });
  };

  if (variant === 'segmented') {
    const isArabic = router.locale === 'ar';

    return (
      <div
        className="relative inline-grid grid-cols-2 items-center gap-1 rounded-full border border-white/15 p-1"
        role="group"
        aria-label="Language"
        dir="ltr"
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-1 start-1 w-[calc(50%-0.25rem)] rounded-full bg-white/20 transition-transform duration-200 ease-spring motion-reduce:transition-none ${
            isArabic ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0'
          }`}
        />
        <button
          type="button"
          onClick={() => switchLanguage('en')}
          className={`relative z-10 min-w-[2.75rem] px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ease-spring ${
            router.locale === 'en'
              ? 'text-white'
              : 'text-white/65 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => switchLanguage('ar')}
          className={`relative z-10 min-w-[2.75rem] px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ease-spring ${
            router.locale === 'ar'
              ? 'text-white'
              : 'text-white/65 hover:text-white'
          }`}
        >
          عربي
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    const isArabic = router.locale === 'ar';
    const nextLocale = isArabic ? 'en' : 'ar';

    return (
      <button
        type="button"
        onClick={() => switchLanguage(nextLocale)}
        className="inline-flex items-center gap-1.5 min-h-10 px-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 ease-spring"
        aria-label={isArabic ? 'Switch to English' : 'Switch to Arabic'}
      >
        <GlobeIcon />
        <span className="text-sm font-medium">{isArabic ? 'ع' : 'en'}</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            router.locale === 'en'
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => switchLanguage('ar')}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            router.locale === 'ar'
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:text-white'
          }`}
        >
          العربية
        </button>
      </div>
    </div>
  );
} 