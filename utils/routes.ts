// Route utilities for country/language-based authentication

// Using the same country codes as the existing system in [countryCode]/index.tsx
export const VALID_COUNTRIES = ['egy', 'saudi'] as const;
export const VALID_LANGUAGES = ['en', 'ar'] as const;

export type ValidCountry = typeof VALID_COUNTRIES[number];
export type ValidLanguage = typeof VALID_LANGUAGES[number];

export const COUNTRY_NAMES = {
  egy: 'Egypt',
  saudi: 'Saudi Arabia'
} as const;

export const LANGUAGE_NAMES = {
  en: 'English',
  ar: 'العربية'
} as const;

// Route builder functions (country code first, then language)
export const buildAuthRoute = (countryCode: string, lang: string, path: string = '') => {
  return `/${countryCode}/${lang}${path}`;
};

export const buildLoginRoute = (countryCode: string, lang: string) => {
  return buildAuthRoute(countryCode, lang, '/login');
};

export const buildRegisterRoute = (countryCode: string, lang: string, type?: 'personal' | 'organization') => {
  const basePath = '/register';
  if (!type) return buildAuthRoute(countryCode, lang, basePath);
  return buildAuthRoute(countryCode, lang, `${basePath}/${type}`);
};

export const buildHomeRoute = (countryCode: string, lang: string) => {
  return buildAuthRoute(countryCode, lang, '');
};

// Validation functions
export const isValidCountry = (country: string): country is ValidCountry => {
  return VALID_COUNTRIES.includes(country as ValidCountry);
};

export const isValidLanguage = (lang: string): lang is ValidLanguage => {
  return VALID_LANGUAGES.includes(lang as ValidLanguage);
};

export const validateRouteParams = (lang: string, countryCode: string) => {
  return isValidLanguage(lang?.toLowerCase()) && isValidCountry(countryCode?.toLowerCase());
};

// Helper to get country name in display format
export const getCountryDisplayName = (country: string) => {
  return COUNTRY_NAMES[country as ValidCountry] || country.toUpperCase();
};

// Helper to get language display name
export const getLanguageDisplayName = (lang: string) => {
  return LANGUAGE_NAMES[lang as ValidLanguage] || lang.toUpperCase();
}; 