import React from 'react';
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguage = (locale: string): void => {
    router.push({ pathname, query }, asPath, { locale });
  };

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