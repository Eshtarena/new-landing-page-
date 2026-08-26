import React, { useState, useEffect, useRef } from "react";
import { useForm, useWatch, Controller, Resolver } from "react-hook-form";
import { useTranslation } from "next-i18next/pages";
import Select from "react-select";
import { object, string, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ContactService } from "../services";
import "react-phone-number-input/style.css";

// List of countries
const countries = [
  { value: "JO", labelEn: "Jordan", labelAr: "الأردن" },
  { value: "SA", labelEn: "Saudi Arabia", labelAr: "المملكة العربية السعودية" },
  {
    value: "AE",
    labelEn: "United Arab Emirates",
    labelAr: "الإمارات العربية المتحدة",
  },
  { value: "KW", labelEn: "Kuwait", labelAr: "الكويت" },
  { value: "BH", labelEn: "Bahrain", labelAr: "البحرين" },
  { value: "QA", labelEn: "Qatar", labelAr: "قطر" },
  { value: "OM", labelEn: "Oman", labelAr: "عمان" },
];

// Country code mapping
const countryToCode = {
  JO: "+962",
  SA: "+966",
  AE: "+971",
  KW: "+965",
  BH: "+973",
  QA: "+974",
  OM: "+968",
};

export default function ContactForm() {
  const { t, i18n } = useTranslation("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Transform countries based on current language
  const countryOptions = countries.map((country) => ({
    value: country.value,
    label: i18n.language === "ar" ? country.labelAr : country.labelEn,
  }));

  // Create validation schema
  const schema = object().shape({
    name: string()
      .required(t("contact.form.validation.name.required"))
      .min(2, t("contact.form.validation.name.min"))
      .max(50, t("contact.form.validation.name.max")),
    email: string()
      .required(t("contact.form.validation.email.required"))
      .email(t("contact.form.validation.email.invalid")),
    country: object({
      value: string().required(),
      label: string().required(),
    })
      .required(t("contact.form.validation.country.required"))
      .nullable(),
    phone: string()
      .required(t("contact.form.validation.phone.required"))
      .matches(
        /^\+\d{1,4}\s\d{6,14}$/,
        t("contact.form.validation.phone.invalid")
      ),
    message: string()
      .required(t("contact.form.validation.message.required"))
      .min(10, t("contact.form.validation.message.min"))
      .max(1000, t("contact.form.validation.message.max")),
  });

  type ContactFormValues = InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema) as Resolver<ContactFormValues>,
    defaultValues: {
      name: "",
      email: "",
      country: null,
      phone: "",
      message: "",
    },
  });

  const selectedCountryValue = useWatch({ control, name: "country" });

  const phoneNumberRef = useRef(phoneNumber);
  useEffect(() => {
    phoneNumberRef.current = phoneNumber;
  });

  // Update phone number when country changes
  useEffect(() => {
    if (selectedCountryValue?.value) {
      const countryCode = countryToCode[selectedCountryValue.value as keyof typeof countryToCode];
      const numberWithoutCode = phoneNumberRef.current.replace(/^\+\d{1,4}\s*/, "");
      const newPhoneNumber = countryCode + " " + numberWithoutCode;
      setPhoneNumber(newPhoneNumber);
      setValue("phone", newPhoneNumber);
    }
  }, [selectedCountryValue, setValue]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const countryCode = selectedCountryValue?.value
      ? countryToCode[selectedCountryValue.value as keyof typeof countryToCode]
      : "+966";

    // Only allow digits after country code
    const numberWithoutCode = value
      .replace(countryCode + " ", "")
      .replace(/\D/g, "");
    const newPhoneNumber = countryCode + " " + numberWithoutCode;

    setPhoneNumber(newPhoneNumber);
    setValue("phone", newPhoneNumber);
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      await ContactService.submit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });
      setSubmitStatus("success");
      reset();
      setPhoneNumber("");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (error: unknown) => `
    w-full min-h-11 rounded-xl border bg-gray-50 px-4 py-3 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:border-transparent transition-all outline-none
    ${
      error
        ? "border-red-400 focus:ring-red-400"
        : "border-gray-200 focus:ring-primary-500"
    }
  `;

  return (
    <>
      {showConfirmation && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-soft-lg border border-black/5 px-12 py-8 text-center min-w-[250px]">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div className="mt-4 text-lg font-semibold text-primary-500">
              {t("contact.form.success")}
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        dir={i18n.dir()}
      >
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("contact.form.name")}
          </label>
          <input
            type="text"
            {...register("name")}
            className={getInputClassName(errors.name)}
            placeholder={t("contact.form.name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("contact.form.email")}
          </label>
          <input
            type="email"
            {...register("email")}
            className={getInputClassName(errors.email)}
            placeholder={t("contact.form.email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Country Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("contact.form.country")}
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                instanceId="contact-country"
                options={countryOptions}
                className={`react-select ${
                  errors.country ? "react-select-error" : ""
                }`}
                classNamePrefix="react-select"
                placeholder={t("contact.form.country")}
                isRtl={i18n.dir() === "rtl"}
              />
            )}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("contact.form.phone")}
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={getInputClassName(errors.phone)}
            placeholder={t("contact.form.phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("contact.form.message")}
          </label>
          <textarea
            {...register("message")}
            rows={4}
            className={getInputClassName(errors.message)}
            placeholder={t("contact.form.message")}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full min-h-12 px-6 py-3.5 text-white font-semibold rounded-full transition-colors duration-200 ease-spring
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-500/90"
              }
            `}
          >
            {isSubmitting
              ? t("contact.form.sending")
              : t("contact.form.submit")}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200/60 rounded-xl text-green-700">
            {t("contact.form.success")}
          </div>
        )}
        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200/60 rounded-xl text-red-700">
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
}
