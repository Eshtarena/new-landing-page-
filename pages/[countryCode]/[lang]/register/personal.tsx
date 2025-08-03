import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InputField from '../../../../components/auth/InputField';
import Button from '../../../../components/auth/Button';
import Stepper from '../../../../components/auth/Stepper';
import { 
  PersonalRegistrationStep1, 
  PersonalRegistrationStep2, 
  FormErrors, 
  RegistrationStep 
} from '../../../../types/auth';
import { 
  validateFullName, 
  validateEmail, 
  validatePhoneNumber, 
  validateBirthdate,
  validatePassword,
  validateConfirmPassword
} from '../../../../utils/validation';
import { 
  validateRouteParams, 
  getCountryDisplayName, 
  buildLoginRoute,
  buildRegisterRoute
} from '../../../../utils/routes';

interface PersonalRegistrationPageProps {
  lang: string;
  countryCode: string;
}

export default function PersonalRegistrationPage({ lang, countryCode }: PersonalRegistrationPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [step1Data, setStep1Data] = useState<PersonalRegistrationStep1>({
    fullName: '',
    email: '',
    phoneNumber: '',
    birthdate: ''
  });
  
  const [step2Data, setStep2Data] = useState<PersonalRegistrationStep2>({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Stepper configuration
  const steps: RegistrationStep[] = [
    {
      stepNumber: 1,
      title: t('auth.personalRegistration.step1.title'),
      isCompleted: currentStep > 1,
      isActive: currentStep === 1
    },
    {
      stepNumber: 2,
      title: t('auth.personalRegistration.step2.title'),
      isCompleted: currentStep > 2,
      isActive: currentStep === 2
    }
  ];

  const handleStep1Change = (field: keyof PersonalRegistrationStep1, value: string) => {
    setStep1Data(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStep2Change = (field: keyof PersonalRegistrationStep2, value: string) => {
    setStep2Data(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    const fullNameError = validateFullName(step1Data.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;
    
    const emailError = validateEmail(step1Data.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhoneNumber(step1Data.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    const birthdateError = validateBirthdate(step1Data.birthdate);
    if (birthdateError) newErrors.birthdate = birthdateError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    const passwordError = validatePassword(step2Data.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(step2Data.password, step2Data.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine all form data
      const registrationData = {
        ...step1Data,
        ...step2Data,
        lang,
        countryCode
      };
      
      // TODO: Implement actual registration logic here
      console.log('Personal registration data:', registrationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to success page or login
      router.push(buildLoginRoute(countryCode, lang) + '?message=registration-success');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: t('auth.common.error') });
    } finally {
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    const countryName = getCountryDisplayName(countryCode);
    return `${t('auth.personalRegistration.title')} - Eshtarena ${countryName}`;
  };

  const switchLanguage = (newLang: string) => {
    router.push(buildRegisterRoute(countryCode, newLang, 'personal'));
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={`Create your personal Eshtarena account in ${countryCode.toUpperCase()}`} />
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
            {t('auth.personalRegistration.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.personalRegistration.stepIndicator', { current: currentStep, total: 2 })}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Stepper */}
          <div className="mb-8">
            <Stepper steps={steps} />
          </div>

          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {errors.general && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('auth.personalRegistration.step1.title')}</h3>
                  <p className="text-sm text-gray-600">{t('auth.personalRegistration.step1.subtitle')}</p>
                </div>

                <InputField
                  label={t('auth.personalRegistration.step1.fullName')}
                  placeholder={t('auth.personalRegistration.step1.fullNamePlaceholder')}
                  value={step1Data.fullName}
                  onChange={(value) => handleStep1Change('fullName', value)}
                  error={errors.fullName}
                  required
                  isRTL={lang === 'ar'}
                />

                <InputField
                  label={t('auth.personalRegistration.step1.email')}
                  type="email"
                  placeholder={t('auth.personalRegistration.step1.emailPlaceholder')}
                  value={step1Data.email}
                  onChange={(value) => handleStep1Change('email', value)}
                  error={errors.email}
                  required
                  isRTL={lang === 'ar'}
                />

                <InputField
                  label={t('auth.personalRegistration.step1.phone')}
                  type="tel"
                  placeholder={t('auth.personalRegistration.step1.phonePlaceholder')}
                  value={step1Data.phoneNumber}
                  onChange={(value) => handleStep1Change('phoneNumber', value)}
                  error={errors.phoneNumber}
                  required
                  isRTL={lang === 'ar'}
                />

                <InputField
                  label={t('auth.personalRegistration.step1.birthdate')}
                  type="date"
                  value={step1Data.birthdate}
                  onChange={(value) => handleStep1Change('birthdate', value)}
                  error={errors.birthdate}
                  required
                  isRTL={lang === 'ar'}
                />

                <div className={`flex ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <Link href={buildRegisterRoute(countryCode, lang)} className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      {t('auth.personalRegistration.navigation.back')}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.personalRegistration.navigation.next')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('auth.personalRegistration.step2.title')}</h3>
                  <p className="text-sm text-gray-600">{t('auth.personalRegistration.step2.subtitle')}</p>
                </div>

                <InputField
                  label={t('auth.personalRegistration.step2.password')}
                  type="password"
                  placeholder={t('auth.personalRegistration.step2.passwordPlaceholder')}
                  value={step2Data.password}
                  onChange={(value) => handleStep2Change('password', value)}
                  error={errors.password}
                  required
                  isRTL={lang === 'ar'}
                />

                <InputField
                  label={t('auth.personalRegistration.step2.confirmPassword')}
                  type="password"
                  placeholder={t('auth.personalRegistration.step2.confirmPasswordPlaceholder')}
                  value={step2Data.confirmPassword}
                  onChange={(value) => handleStep2Change('confirmPassword', value)}
                  error={errors.confirmPassword}
                  required
                  isRTL={lang === 'ar'}
                />

                {/* Password Requirements */}
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">{t('auth.personalRegistration.step2.requirements.title')}</p>
                  <ul className="space-y-1">
                    <li>• {t('auth.personalRegistration.step2.requirements.length')}</li>
                    <li>• {t('auth.personalRegistration.step2.requirements.uppercase')}</li>
                    <li>• {t('auth.personalRegistration.step2.requirements.number')}</li>
                  </ul>
                </div>

                <div className={`flex ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.personalRegistration.navigation.previous')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    className="flex-1"
                  >
                    {t('auth.personalRegistration.navigation.createAccount')}
                  </Button>
                </div>
              </form>
            )}

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
                  <Button variant="outline" size="lg" className="w-full">
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