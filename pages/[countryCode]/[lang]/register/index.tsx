import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Button from '../../../../components/auth/Button';
import { AccountType } from '../../../../types/auth';
import { 
  validateRouteParams, 
  getCountryDisplayName, 
  buildLoginRoute,
  buildRegisterRoute 
} from '../../../../utils/routes';

interface RegisterPageProps {
  lang: string;
  countryCode: string;
}

export default function RegisterPage({ lang, countryCode }: RegisterPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('personal');

  const handleGetStarted = () => {
    if (selectedAccountType === 'personal') {
      router.push(buildRegisterRoute(countryCode, lang, 'personal'));
    } else {
      router.push(buildRegisterRoute(countryCode, lang, 'organization'));
    }
  };

  const getPageTitle = () => {
    const countryName = getCountryDisplayName(countryCode);
    return `${t('auth.register.title')} - Eshtarena ${countryName}`;
  };

  const switchLanguage = (newLang: string) => {
    router.push(buildRegisterRoute(countryCode, newLang));
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={`Create your Eshtarena account in ${countryCode.toUpperCase()}`} />
      </Head>

      <div className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              className="w-32 h-auto"
              src="/eshtarena_logo.svg"
              alt="Eshtarena"
            />
          </div>
          
          {/* Language Switcher */}
          <div className={`flex justify-center mt-4 ${lang === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-3 py-1 text-sm rounded ${
                lang === 'en' 
                  ? 'bg-[#340040] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('auth.common.languageSwitcher.english')}
            </button>
            <button
              onClick={() => switchLanguage('ar')}
              className={`px-3 py-1 text-sm rounded ${
                lang === 'ar' 
                  ? 'bg-[#340040] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('auth.common.languageSwitcher.arabic')}
            </button>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.register.subtitle')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {/* Account Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {t('auth.register.accountTypeQuestion')}
              </h3>

              {/* Personal Account Option */}
              <div
                className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedAccountType === 'personal'
                    ? 'border-[#340040] ring-2 ring-purple-200 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedAccountType('personal')}
              >
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="personal"
                      name="accountType"
                      type="radio"
                      checked={selectedAccountType === 'personal'}
                      onChange={() => setSelectedAccountType('personal')}
                      className="h-4 w-4 text-[#340040] focus:ring-[#340040] border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="personal" className="font-medium text-gray-900 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#340040]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {t('auth.register.personal.title')}
                      </div>
                    </label>
                    <p className="text-sm text-gray-500">
                      {t('auth.register.personal.description')}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      • {t('auth.register.personal.feature1')}
                      • {t('auth.register.personal.feature2')}
                      • {t('auth.register.personal.feature3')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Account Option */}
              <div
                className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedAccountType === 'organization'
                    ? 'border-[#340040] ring-2 ring-purple-200 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedAccountType('organization')}
              >
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="organization"
                      name="accountType"
                      type="radio"
                      checked={selectedAccountType === 'organization'}
                      onChange={() => setSelectedAccountType('organization')}
                      className="h-4 w-4 text-[#340040] focus:ring-[#340040] border-gray-300"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="organization" className="font-medium text-gray-900 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#340040]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        {t('auth.register.organization.title')}
                      </div>
                    </label>
                    <p className="text-sm text-gray-500">
                      {t('auth.register.organization.description')}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      • {t('auth.register.organization.feature1')}
                      • {t('auth.register.organization.feature2')}
                      • {t('auth.register.organization.feature3')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="mt-8">
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {t('auth.register.getStarted')}
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.register.alreadyHaveAccount')}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href={buildLoginRoute(countryCode, lang)}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {t('auth.register.signInInstead')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const { lang, countryCode } = params as { lang: string; countryCode: string };
  
  // Validate language and country codes
  if (!validateRouteParams(lang, countryCode)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lang: lang.toLowerCase(),
      countryCode: countryCode.toLowerCase(),
      ...(await serverSideTranslations(lang.toLowerCase(), ['common'])),
    },
  };
}; 