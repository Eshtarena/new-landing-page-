import React from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Term } from "../../types/terms";
import { PrivacyService } from "../../services";
import Navbar from "../../components/landingpage/Navbar";
import SiteFooter from "../../components/SiteFooter";

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
        <title>{`${t("privacy.pageTitle")} | Eshtarena`}</title>
        <meta name="description" content={t("privacy.pageDescription")} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Header — dark band so the floating glass navbar stays legible */}
        <header className="bg-primary-500 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center">
              {t("privacy.pageTitle")}
            </h1>

            {/* Page Description */}
            <p className="mt-4 text-lg md:text-xl text-white/80 text-center max-w-3xl mx-auto">
              {t("privacy.pageDescription")}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="bg-white rounded-2xl shadow-soft border border-black/5 w-full mb-8 last:mb-0"
            >
              <div className="p-6 md:p-8">
                <h2
                  className="text-2xl font-bold tracking-tight text-primary-500 mb-4"
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
        </main>

        <SiteFooter />
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
