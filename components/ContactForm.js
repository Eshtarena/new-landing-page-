import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Select from 'react-select';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { submitContactForm } from '../utils/api';
import 'react-phone-number-input/style.css';

// List of countries
const countries = [
  { value: 'JO', labelEn: 'Jordan', labelAr: 'الأردن' },
  { value: 'SA', labelEn: 'Saudi Arabia', labelAr: 'المملكة العربية السعودية' },
  { value: 'AE', labelEn: 'United Arab Emirates', labelAr: 'الإمارات العربية المتحدة' },
  { value: 'KW', labelEn: 'Kuwait', labelAr: 'الكويت' },
  { value: 'BH', labelEn: 'Bahrain', labelAr: 'البحرين' },
  { value: 'QA', labelEn: 'Qatar', labelAr: 'قطر' },
  { value: 'OM', labelEn: 'Oman', labelAr: 'عمان' },
  { value: 'EG', labelEn: 'Egypt', labelAr: 'مصر' }
];

export default function ContactForm() {
  const { t, i18n } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Transform countries based on current language
  const countryOptions = countries.map(country => ({
    value: country.value,
    label: i18n.language === 'ar' ? country.labelAr : country.labelEn
  }));

  // Create validation schema
  const schema = object().shape({
    name: string()
      .required(t('contact.form.validation.name.required'))
      .min(2, t('contact.form.validation.name.min'))
      .max(50, t('contact.form.validation.name.max')),
    email: string()
      .required(t('contact.form.validation.email.required'))
      .email(t('contact.form.validation.email.invalid')),
    country: object()
      .required(t('contact.form.validation.country.required'))
      .nullable(),
    phone: string()
      .required(t('contact.form.validation.phone.required'))
      .test('phone', t('contact.form.validation.phone.invalid'), value => 
        value ? isValidPhoneNumber(value) : false
      ),
    message: string()
      .required(t('contact.form.validation.message.required'))
      .min(10, t('contact.form.validation.message.min'))
      .max(1000, t('contact.form.validation.message.max')),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      country: null,
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const result = await submitContactForm(data);
      setSubmitStatus('success');
      reset();
      // You might want to do something with the result, like showing the submissionId
      console.log('Submission successful:', result);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (error) => `
    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
    ${error 
      ? 'border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:ring-purple-200 focus:border-[#340040]'
    }
  `;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={i18n.dir()}>
      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.form.name')}
        </label>
        <input
          type="text"
          {...register('name')}
          className={getInputClassName(errors.name)}
          placeholder={t('contact.form.name')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.form.email')}
        </label>
        <input
          type="email"
          {...register('email')}
          className={getInputClassName(errors.email)}
          placeholder={t('contact.form.email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Country Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.form.country')}
        </label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={countryOptions}
              className={`react-select ${errors.country ? 'react-select-error' : ''}`}
              classNamePrefix="react-select"
              placeholder={t('contact.form.country')}
              isRtl={i18n.dir() === 'rtl'}
            />
          )}
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.form.phone')}
        </label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              {...field}
              international
              defaultCountry="EG"
              className={`phone-input-container ${errors.phone ? 'phone-input-error' : ''}`}
              inputComponent={({ ...props }) => (
                <input
                  {...props}
                  className={getInputClassName(errors.phone)}
                  placeholder={t('contact.form.phone')}
                />
              )}
            />
          )}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Message Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('contact.form.message')}
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className={getInputClassName(errors.message)}
          placeholder={t('contact.form.message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full px-6 py-3 text-white rounded-lg transition-colors duration-200
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#340040] hover:bg-opacity-90'
            }
          `}
        >
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {t('contact.form.success')}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errorMessage}
        </div>
      )}
    </form>
  );
} 