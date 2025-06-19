import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguage = (locale) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 text-sm ${
          router.locale === 'en'
            ? 'text-white font-bold'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        EN
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-2 py-1 text-sm ${
          router.locale === 'ar'
            ? 'text-white font-bold'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        عربي
      </button>
    </div>
  );
} 