import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InputField from '../../../components/auth/InputField';
import Button from '../../../components/auth/Button';
import { LoginFormData, FormErrors } from '../../../types/auth';
import { validateEmail, validateRequired } from '../../../utils/validation';
import { 
  validateRouteParams, 
  getCountryDisplayName, 
  buildLoginRoute,
  buildRegisterRoute,
  buildHomeRoute 
} from '../../../utils/routes';

interface LoginPageProps {
  lang: string;
  countryCode: string;
}

export default function LoginPage({ lang, countryCode }: LoginPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    // Validate password
    const passwordError = validateRequired(formData.password, t('auth.validation.password.required'));
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual login logic here
      console.log('Login attempt:', formData, { lang, countryCode });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard or home page after successful login
      router.push(buildHomeRoute(countryCode, lang) + '/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: t('auth.login.errorGeneral') });
    } finally {
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    const countryName = getCountryDisplayName(countryCode);
    return `${t('auth.login.title')} - Eshtarena ${countryName}`;
  };

  const switchLanguage = (newLang: string) => {
    router.push(buildLoginRoute(countryCode, newLang));
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={`Login to your Eshtarena account in ${countryCode.toUpperCase()}`} />
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
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <InputField
                label={t('auth.login.email')}
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                required
                isRTL={lang === 'ar'}
              />

              <InputField
                label={t('auth.login.password')}
                type="password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                error={errors.password}
                required
                isRTL={lang === 'ar'}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#340040] focus:ring-[#340040] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className={`block text-sm text-gray-900 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>
                    {t('auth.login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <Link href={`/${countryCode}/${lang}/forgot-password`} className="font-medium text-[#340040] hover:text-purple-800">
                    {t('auth.login.forgotPassword')}
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                {t('auth.login.signInButton')}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.login.newToEshtarena')}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href={buildRegisterRoute(countryCode, lang)}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {t('auth.login.createAccount')}
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