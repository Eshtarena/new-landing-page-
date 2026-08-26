import ContactForm from "../ContactForm";
import { useTranslation } from "next-i18next/pages";
import Image from "next/image";
import { isXPlatformSocialLink } from "../../services/social.service";
import AppStoreBadges from "../AppStoreBadges";

export default function ContactSection({ socialData }) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  return (
    <section
      id="contact"
      className={`bg-white py-10 sm:py-12 md:py-20 scroll-mt-20 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-24 mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-primary-500 mb-4 sm:mb-6 leading-tight">
            {t("contact.title")}
          </h2>
          <div className="w-20 h-1.5 bg-primary-500/10 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-soft-lg border border-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Contact Form Side */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-16 order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Contact Information Sidebar */}
            <div className={`lg:col-span-5 bg-gray-50/50 p-5 sm:p-8 md:p-16 order-1 lg:order-2 flex flex-col justify-between relative ${isRTL ? "border-e border-gray-100" : "border-s border-gray-100"}`}>
              <div className="space-y-8 sm:space-y-12">
                {/* Location */}
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/10">
                    <svg
                      className="w-6 h-6 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-500 mb-2">
                      {t("contact.info.location.title")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("contact.info.location.address")}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/10">
                    <svg
                      className="w-6 h-6 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-500 mb-2">
                      {t("contact.info.email.title")}
                    </h3>
                    <a
                      href="mailto:Support@sharena.sa"
                      className="text-gray-600 hover:text-primary-500 transition-colors font-medium break-all"
                    >
                      {t("contact.info.email.address")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media & Apps Footer Area */}
              <div className="pt-12 mt-12 border-t border-gray-100">
                <div className="flex flex-col gap-10">
                  {/* Social links */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary-500/50 uppercase tracking-[0.2em]">
                      {t("contact.info.social.title")}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {socialData.social.map((social) => (
                        <a
                          key={social._id}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all duration-300 border shadow-sm hover:shadow-lg hover:border-primary-500 group ${
                            isXPlatformSocialLink(social)
                              ? "bg-black border-black/10"
                              : "bg-white border-gray-100"
                          }`}
                          title={social.title}
                        >
                          <Image
                            src={social.logo}
                            alt={social.title}
                            width={22}
                            height={22}
                            className={`object-contain transition-all ${
                              isXPlatformSocialLink(social)
                                ? ""
                                : "group-hover:brightness-0 group-hover:invert"
                            }`}
                          />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* App store links */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary-500/50 uppercase tracking-[0.2em]">
                      {t("contact.info.apps.title")}
                    </h3>
                    <AppStoreBadges
                      containerClassName="flex flex-row gap-3"
                      badgeClassName="w-[125px] h-[38px] relative hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
