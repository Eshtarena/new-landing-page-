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
  OrganizationRegistrationStep1, 
  OrganizationRegistrationStep2, 
  OrganizationRegistrationStep3,
  FormErrors, 
  RegistrationStep 
} from '../../../../types/auth';
import { 
  validateCompanyName, 
  validateEmail, 
  validateRequired,
  validateCRNumber,
  validateVATNumber,
  validatePassword,
  validateConfirmPassword
} from '../../../../utils/validation';
import { 
  validateRouteParams, 
  getCountryDisplayName, 
  buildLoginRoute,
  buildRegisterRoute
} from '../../../../utils/routes';

interface OrganizationRegistrationPageProps {
  lang: string;
  countryCode: string;
}

export default function OrganizationRegistrationPage({ lang, countryCode }: OrganizationRegistrationPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [step1Data, setStep1Data] = useState<OrganizationRegistrationStep1>({
    commercialName: '',
    registeredName: '',
    email: '',
    scopeOfBusiness: ''
  });
  
  const [step2Data, setStep2Data] = useState<OrganizationRegistrationStep2>({
    crNumber: '',
    vatRegistrationNumber: ''
  });
  
  const [step3Data, setStep3Data] = useState<OrganizationRegistrationStep3>({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Stepper configuration
  const steps: RegistrationStep[] = [
    {
      stepNumber: 1,
      title: t('auth.organizationRegistration.stepper.companyInfo'),
      isCompleted: currentStep > 1,
      isActive: currentStep === 1
    },
    {
      stepNumber: 2,
      title: t('auth.organizationRegistration.stepper.legalDetails'),
      isCompleted: currentStep > 2,
      isActive: currentStep === 2
    },
    {
      stepNumber: 3,
      title: t('auth.organizationRegistration.stepper.security'),
      isCompleted: currentStep > 3,
      isActive: currentStep === 3
    }
  ];

  const handleStep1Change = (field: keyof OrganizationRegistrationStep1, value: string) => {
    setStep1Data(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStep2Change = (field: keyof OrganizationRegistrationStep2, value: string) => {
    setStep2Data(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStep3Change = (field: keyof OrganizationRegistrationStep3, value: string) => {
    setStep3Data(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    const commercialNameError = validateCompanyName(step1Data.commercialName);
    if (commercialNameError) newErrors.commercialName = commercialNameError;
    
    const registeredNameError = validateCompanyName(step1Data.registeredName);
    if (registeredNameError) newErrors.registeredName = registeredNameError;
    
    const emailError = validateEmail(step1Data.email);
    if (emailError) newErrors.email = emailError;
    
    const scopeError = validateRequired(step1Data.scopeOfBusiness, t('auth.validation.scopeOfBusiness.required'));
    if (scopeError) newErrors.scopeOfBusiness = scopeError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    const crError = validateCRNumber(step2Data.crNumber);
    if (crError) newErrors.crNumber = crError;
    
    const vatError = validateVATNumber(step2Data.vatRegistrationNumber);
    if (vatError) newErrors.vatRegistrationNumber = vatError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    
    const passwordError = validatePassword(step3Data.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(step3Data.password, step3Data.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine all form data
      const registrationData = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        lang,
        countryCode
      };
      
      // TODO: Implement actual registration logic here
      console.log('Organization registration data:', registrationData);
      
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
    return `${t('auth.organizationRegistration.title')} - Eshtarena ${countryName}`;
  };

  const switchLanguage = (newLang: string) => {
    router.push(buildRegisterRoute(countryCode, newLang, 'organization'));
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={`Create your organization Eshtarena account in ${countryCode.toUpperCase()}`} />
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
            {t('auth.organizationRegistration.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.organizationRegistration.stepIndicator', { current: currentStep, total: 3 })}
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

            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('auth.organizationRegistration.step1.title')}</h3>
                  <p className="text-sm text-gray-600">{t('auth.organizationRegistration.step1.subtitle')}</p>
                </div>

                <InputField
                  label={t('auth.organizationRegistration.step1.commercialName')}
                  placeholder={t('auth.organizationRegistration.step1.commercialNamePlaceholder')}
                  value={step1Data.commercialName}
                  onChange={(value) => handleStep1Change('commercialName', value)}
                  error={errors.commercialName}
                  required
                />

                <InputField
                  label={t('auth.organizationRegistration.step1.registeredName')}
                  placeholder={t('auth.organizationRegistration.step1.registeredNamePlaceholder')}
                  value={step1Data.registeredName}
                  onChange={(value) => handleStep1Change('registeredName', value)}
                  error={errors.registeredName}
                  required
                />

                <InputField
                  label={t('auth.organizationRegistration.step1.email')}
                  type="email"
                  placeholder={t('auth.organizationRegistration.step1.emailPlaceholder')}
                  value={step1Data.email}
                  onChange={(value) => handleStep1Change('email', value)}
                  error={errors.email}
                  required
                />

                <InputField
                  label={t('auth.organizationRegistration.step1.scopeOfBusiness')}
                  placeholder={t('auth.organizationRegistration.step1.scopeOfBusinessPlaceholder')}
                  value={step1Data.scopeOfBusiness}
                  onChange={(value) => handleStep1Change('scopeOfBusiness', value)}
                  error={errors.scopeOfBusiness}
                  required
                />

                <div className="flex space-x-4">
                  <Link href={buildRegisterRoute(countryCode, lang)} className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      {t('auth.organizationRegistration.navigation.back')}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.organizationRegistration.navigation.next')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Legal Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('auth.organizationRegistration.step2.title')}</h3>
                  <p className="text-sm text-gray-600">{t('auth.organizationRegistration.step2.subtitle')}</p>
                </div>

                <InputField
                  label={t('auth.organizationRegistration.step2.crNumber')}
                  placeholder={t('auth.organizationRegistration.step2.crNumberPlaceholder')}
                  value={step2Data.crNumber}
                  onChange={(value) => handleStep2Change('crNumber', value.replace(/\D/g, ''))}
                  error={errors.crNumber}
                  required
                />

                <InputField
                  label={t('auth.organizationRegistration.step2.vatNumber')}
                  placeholder={t('auth.organizationRegistration.step2.vatNumberPlaceholder')}
                  value={step2Data.vatRegistrationNumber}
                  onChange={(value) => handleStep2Change('vatRegistrationNumber', value.replace(/\D/g, ''))}
                  error={errors.vatRegistrationNumber}
                  required
                />

                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">{t('auth.organizationRegistration.step2.documentsInfo.title')}</p>
                  <ul className="space-y-1">
                    <li>• {t('auth.organizationRegistration.step2.documentsInfo.cr')}</li>
                    <li>• {t('auth.organizationRegistration.step2.documentsInfo.vat')}</li>
                    <li>• {t('auth.organizationRegistration.step2.documentsInfo.verification')}</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.organizationRegistration.navigation.previous')}
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.organizationRegistration.navigation.next')}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Security Setup */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{t('auth.organizationRegistration.step3.title')}</h3>
                  <p className="text-sm text-gray-600">{t('auth.organizationRegistration.step3.subtitle')}</p>
                </div>

                <InputField
                  label={t('auth.organizationRegistration.step3.password')}
                  type="password"
                  placeholder={t('auth.organizationRegistration.step3.passwordPlaceholder')}
                  value={step3Data.password}
                  onChange={(value) => handleStep3Change('password', value)}
                  error={errors.password}
                  required
                />

                <InputField
                  label={t('auth.organizationRegistration.step3.confirmPassword')}
                  type="password"
                  placeholder={t('auth.organizationRegistration.step3.confirmPasswordPlaceholder')}
                  value={step3Data.confirmPassword}
                  onChange={(value) => handleStep3Change('confirmPassword', value)}
                  error={errors.confirmPassword}
                  required
                />

                {/* Password Requirements */}
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">{t('auth.organizationRegistration.step3.requirements.title')}</p>
                  <ul className="space-y-1">
                    <li>• {t('auth.organizationRegistration.step3.requirements.length')}</li>
                    <li>• {t('auth.organizationRegistration.step3.requirements.uppercase')}</li>
                    <li>• {t('auth.organizationRegistration.step3.requirements.number')}</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    {t('auth.organizationRegistration.navigation.previous')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    className="flex-1"
                  >
                    {t('auth.organizationRegistration.navigation.createAccount')}
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