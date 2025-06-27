import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { fetchSocialLinks } from "../utils/api";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


export default function JoinSuppliers() {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
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
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await fetchSocialLinks();
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
    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
    ${error 
      ? 'border-red-500 focus:ring-red-200' 
      : hasValue
        ? 'border-[#340040] focus:ring-purple-200 focus:border-[#340040]'
        : 'border-gray-200 focus:ring-purple-200 focus:border-[#340040]'
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#340040] text-center mb-8">
              {t("suppliers.form.title")}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#340040]">
                  {t("suppliers.form.company_info")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.company_name")}
                    </label>
                    <input
                      type="text"
                      {...register("companyName")}
                      className={getInputClassName(errors.companyName, watch("companyName"))}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.category")}
                    </label>
                    <input
                      type="text"
                      {...register("category")}
                      className={getInputClassName(errors.category, watch("category"))}
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.business_email")}
                    </label>
                    <input
                      type="email"
                      {...register("businessEmail")}
                      className={getInputClassName(errors.businessEmail, watch("businessEmail"))}
                    />
                    {errors.businessEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.phone_number")}
                    </label>
                    <input
                      type="tel"
                      {...register("phoneNumber")}
                      className={getInputClassName(errors.phoneNumber, watch("phoneNumber"))}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("suppliers.form.headquarters")}
                  </label>
                  <input
                    type="text"
                    {...register("headquarters")}
                    className={getInputClassName(errors.headquarters, watch("headquarters"))}
                  />
                  {errors.headquarters && (
                    <p className="mt-1 text-sm text-red-600">{errors.headquarters.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Person Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#340040]">
                  {t("suppliers.form.contact_person")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.contact_name")}
                    </label>
                    <input
                      type="text"
                      {...register("contactPerson.name")}
                      className={getInputClassName(errors.contactPerson?.name, watch("contactPerson.name"))}
                    />
                    {errors.contactPerson?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.contact_title")}
                    </label>
                    <input
                      type="text"
                      {...register("contactPerson.title")}
                      className={getInputClassName(errors.contactPerson?.title, watch("contactPerson.title"))}
                    />
                    {errors.contactPerson?.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.contact_email")}
                    </label>
                    <input
                      type="email"
                      {...register("contactPerson.email")}
                      className={getInputClassName(errors.contactPerson?.email, watch("contactPerson.email"))}
                    />
                    {errors.contactPerson?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("suppliers.form.contact_phone")}
                    </label>
                    <input
                      type="tel"
                      {...register("contactPerson.phone")}
                      className={getInputClassName(errors.contactPerson?.phone, watch("contactPerson.phone"))}
                    />
                    {errors.contactPerson?.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson.phone.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("suppliers.form.message")}
                  </label>
                  <textarea
                    {...register("contactPerson.message")}
                    rows="4"
                    className={getInputClassName(errors.contactPerson?.message, watch("contactPerson.message"))}
                  ></textarea>
                  {errors.contactPerson?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message.message}</p>
                  )}
                </div>
              </div>

              {/* Form Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                  {t("suppliers.form.success") || "Form submitted successfully!"}
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  {errorMessage || t("suppliers.form.error") || "An error occurred. Please try again."}
                </div>
              )}

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-[#340040] text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300 ${
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