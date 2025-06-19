import { useState } from "react";
import ContactForm from "../components/ContactForm";
import { useTranslation } from "next-i18next";
import { submitContactForm } from "../utils/api";
import Image from "next/image";
import { STORES_IMAGES_LINKS } from "../utils/consts";

// API base URL constant
const API_BASE_URL = "https://api.eshtarena.com";

export default function ContactSection({ socialData }) {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: null,
    phone: "",
    message: "",
  });

  // Function to get full image URL
  const getImageUrl = (logoPath) => {
    console.log(`${API_BASE_URL}/public/advice/${logoPath}`);

    return `${API_BASE_URL}/public/advice/${logoPath}`;
  };

  return (
    <section id="contact" className="bg-white py-16 md:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#340040] mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-lg text-gray-600">{t("contact.description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-2xl p-8 lg:sticky lg:top-24">
            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-[#340040] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#340040]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#340040] mb-1">
                    {t("contact.info.location.title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("contact.info.location.address")}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {/* <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-[#340040] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#340040]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#340040] mb-1">
                    {t('contact.info.phone.title')}
                  </h3>
                  <a 
                    href="tel:+962790000000" 
                    className="text-gray-600 hover:text-[#340040] transition-colors"
                  >
                    +962 79 000 0000
                  </a>
                </div>
              </div> */}

              {/* Email */}
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-[#340040] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#340040]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#340040] mb-1">
                    {t("contact.info.email.title")}
                  </h3>
                  <a
                    href="mailto:customerservice@eshtarena.com"
                    className="text-gray-600 hover:text-[#340040] transition-colors"
                  >
                    {t("contact.info.email.address")}
                  </a>
                </div>
              </div>

              {/* Social Media Links */}
              {socialData && (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#340040] mb-4">
                    {t("contact.info.social.title")}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {socialData.social.map((social) => (
                      <a
                        key={social._id}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#340040] bg-opacity-10 rounded-lg flex items-center justify-center text-[#340040] hover:bg-[#340040] hover:text-white transition-colors"
                        title={social.title}
                      >
                        <Image
                          src={social.logo}
                          alt={social.title}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </a>
                    ))}
                  </div>

                  {/* App Store Links */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    {socialData.google && (
                      <a
                        href={socialData.google}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[160px]"
                      >
                        <Image
                          src={STORES_IMAGES_LINKS.google}
                          alt="Get it on Google Play"
                          width={160}
                          height={48}
                          className="w-full h-auto"
                        />
                      </a>
                    )}
                    {socialData.apple && (
                      <a
                        href={socialData.apple}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[160px]"
                      >
                        <Image
                          src={STORES_IMAGES_LINKS.apple}
                          alt="Download on the App Store"
                          width={160}
                          height={48}
                          className="w-full h-auto"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
