import React from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Term } from "../../types/terms";
import { PrivacyService } from "../../services";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Logo from "../../components/Logo";

interface PrivacyPolicyProps {
  policies: Term[];
}

export default function PrivacyPolicy({ policies }: PrivacyPolicyProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isArabic = router.locale === "ar";

  return (
    <>
      <Head>
        <title>{t("privacy.pageTitle")} | Eshtarena</title>
        <meta name="description" content={t("privacy.pageDescription")} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#340040] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Language Switcher - Top Right */}
            <div className="flex justify-end mb-6">
              <LanguageSwitcher />
            </div>

            {/* Logo - Centered */}
            <div className="flex justify-center mb-6">
              <Logo width={150} height={40} className="mb-2" href="/" />
            </div>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-white text-center">
              {t("privacy.pageTitle")}
            </h1>

            {/* Page Description */}
            <p className="mt-4 text-xl text-white/80 text-center max-w-3xl mx-auto">
              {t("privacy.pageDescription")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="bg-white rounded-lg w-full mb-8 last:mb-0"
            >
              <div className="p-6">
                <h2
                  className="text-2xl font-bold text-[#340040] mb-4"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {isArabic ? policy.title_ar : policy.title_en}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {(isArabic ? policy.content_ar : policy.content_en)
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  PrivacyPolicyProps
> = async ({ locale = "en" }) => {
  try {
    const { policies } = await PrivacyService.getPrivacyPolicy("consumer");

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        policies,
      },
    };
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return {
      notFound: true,
    };
  }
};
