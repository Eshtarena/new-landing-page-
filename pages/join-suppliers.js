import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Navbar from "../components/landingpage/Navbar";
import Footer from "../components/landingpage/Footer";
import { useState, useEffect } from "react";
import { SocialService } from "../services";
import { useForm, useWatch } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


export default function JoinSuppliers() {
  const { t } = useTranslation("common");
  const [socialData, setSocialData] = useState({ social: [], apple: "", google: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Create validation schema
  const schema = object().shape({
    companyName: string()
      .required(t("suppliers.form.validation.company_name.required") || "Company name is required")
      .min(2, t("suppliers.form.validation.company_name.min") || "Company name must be at least 2 characters")
      .max(100, t("suppliers.form.validation.company_name.max") || "Company name must be less than 100 characters"),
    category: string()
      .required(t("suppliers.form.validation.category.required") || "Category is required")
      .min(2, t("suppliers.form.validation.category.min") || "Category must be at least 2 characters"),
    businessEmail: string()
      .required(t("suppliers.form.validation.business_email.required") || "Business email is required")
      .email(t("suppliers.form.validation.business_email.invalid") || "Invalid email format"),
    phoneNumber: string()
      .required(t("suppliers.form.validation.phone_number.required") || "Phone number is required")
      .matches(/^\+?[1-9]\d{1,14}$/, t("suppliers.form.validation.phone_number.invalid") || "Invalid phone number"),
    headquarters: string()
      .required(t("suppliers.form.validation.headquarters.required") || "Head quarter address is required")
      .min(5, t("suppliers.form.validation.headquarters.min") || "Address must be at least 5 characters"),
    contactPerson: object().shape({
      name: string()
        .required(t("suppliers.form.validation.contact_name.required") || "Contact name is required")
        .min(2, t("suppliers.form.validation.contact_name.min") || "Name must be at least 2 characters"),
      title: string()
        .required(t("suppliers.form.validation.contact_title.required") || "Title is required"),
      email: string()
        .required(t("suppliers.form.validation.contact_email.required") || "Email is required")
        .email(t("suppliers.form.validation.contact_email.invalid") || "Invalid email format"),
      phone: string()
        .required(t("suppliers.form.validation.contact_phone.required") || "Phone number is required")
        .matches(/^\+?[1-9]\d{1,14}$/, t("suppliers.form.validation.contact_phone.invalid") || "Invalid phone number"),
      message: string()
        .required(t("suppliers.form.validation.message.required") || "Message is required")
        .min(10, t("suppliers.form.validation.message.min") || "Message must be at least 10 characters")
        .max(1000, t("suppliers.form.validation.message.max") || "Message must be less than 1000 characters")
    })
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await SocialService.getLinks();
        setSocialData(data);
      } catch (error) {
        console.error("Error loading social links:", error);
      }
    };
    loadSocialLinks();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // TODO: Implement API call to submit supplier form
      console.log(data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error.message || t("suppliers.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (error, hasValue) => `
    w-full min-h-11 px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all
    ${error
      ? 'border-red-400 focus:ring-red-400'
      : hasValue
        ? 'border-primary-500/40 focus:ring-primary-500 focus:border-transparent'
        : 'border-gray-200 focus:ring-primary-500 focus:border-transparent'
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page hero — dark band so the floating glass navbar stays legible */}
      <header className="bg-primary-500 pt-32 pb-20 md:pt-40 md:pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {t("suppliers.form.title")}
          </h1>
        </div>
      </header>

      <main className="pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-4 -mt-10 md:-mt-12">
          <div className="bg-white rounded-3xl shadow-soft-lg border border-black/5 p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-primary-500">
                  {t("suppliers.form.company_info")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.company_name")}
                    </label>
                    <input
                      type="text"
                      {...register("companyName")}
                      className={getInputClassName(errors.companyName, watchedValues.companyName)}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.category")}
                    </label>
                    <input
                      type="text"
                      {...register("category")}
                      className={getInputClassName(errors.category, watchedValues.category)}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.business_email")}
                    </label>
                    <input
                      type="email"
                      {...register("businessEmail")}
                      className={getInputClassName(errors.businessEmail, watchedValues.businessEmail)}
                    />
                    {errors.businessEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.phone_number")}
                    </label>
                    <input
                      type="tel"
                      {...register("phoneNumber")}
                      className={getInputClassName(errors.phoneNumber, watchedValues.phoneNumber)}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("suppliers.form.headquarters")}
                  </label>
                  <input
                    type="text"
                    {...register("headquarters")}
                    className={getInputClassName(errors.headquarters, watchedValues.headquarters)}
                  />
                  {errors.headquarters && (
                    <p className="mt-1 text-sm text-red-600">{errors.headquarters.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Person Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-primary-500">
                  {t("suppliers.form.contact_person")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.contact_name")}
                    </label>
                    <input
                      type="text"
                      {...register("contactPerson.name")}
                      className={getInputClassName(errors.contactPerson?.name, watchedValues.contactPerson?.name)}
                    />
                    {errors.contactPerson?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.contact_title")}
                    </label>
                    <input
                      type="text"
                      {...register("contactPerson.title")}
                      className={getInputClassName(errors.contactPerson?.title, watchedValues.contactPerson?.title)}
                    />
                    {errors.contactPerson?.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.contact_email")}
                    </label>
                    <input
                      type="email"
                      {...register("contactPerson.email")}
                      className={getInputClassName(errors.contactPerson?.email, watchedValues.contactPerson?.email)}
                    />
                    {errors.contactPerson?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("suppliers.form.contact_phone")}
                    </label>
                    <input
                      type="tel"
                      {...register("contactPerson.phone")}
                      className={getInputClassName(errors.contactPerson?.phone, watchedValues.contactPerson?.phone)}
                    />
                    {errors.contactPerson?.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.phone.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("suppliers.form.message")}
                  </label>
                  <textarea
                    {...register("contactPerson.message")}
                    rows="4"
                    className={getInputClassName(errors.contactPerson?.message, watchedValues.contactPerson?.message)}
                  ></textarea>
                  {errors.contactPerson?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message.message}</p>
                  )}
                </div>
              </div>

              {/* Form Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200/60 text-green-700 px-4 py-3 rounded-xl relative" role="alert">
                  {t("suppliers.form.success") || "Form submitted successfully!"}
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200/60 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                  {errorMessage || t("suppliers.form.error") || "An error occurred. Please try again."}
                </div>
              )}

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center min-h-12 px-10 py-3 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-500/90 transition-colors duration-300 ease-spring ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? t("suppliers.form.submitting") || "Submitting..." : t("suppliers.form.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer socialData={socialData} />
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
} 