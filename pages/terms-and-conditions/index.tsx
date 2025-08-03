import React from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Term } from "../../types/terms";
import { TermsService } from "../../services";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Logo from "../../components/Logo";

interface TermsAndConditionsProps {
  terms: Term[];
}

export default function TermsAndConditions({ terms }: TermsAndConditionsProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isArabic = router.locale === "ar";

  return (
    <>
      <Head>
        <title>{t("terms.pageTitle")} | Eshtarena</title>
        <meta name="description" content={t("terms.pageDescription")} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#340040] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Row: Language Switcher */}
            <div className="flex justify-end mb-4">
              <LanguageSwitcher />
            </div>

            {/* Logo: Centered */}
            <div className="flex justify-center mb-8">
              <Logo width={150} height={40} href="/" />
            </div>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-white text-center">
              {t("terms.pageTitle")}
            </h1>

            {/* Page Description */}
            <p className="mt-4 text-xl text-white/80 text-center max-w-3xl mx-auto">
              {t("terms.pageDescription")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          {terms.map((term) => (
            <div
              key={term._id}
              className="bg-white rounded-lg w-full mb-8 last:mb-0"
            >
              <div className="p-6">
                <h2
                  className="text-2xl font-bold text-[#340040] mb-4"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {isArabic ? term.title_ar : term.title_en}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {(isArabic ? term.content_ar : term.content_en)
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
  TermsAndConditionsProps
> = async ({ locale = "en" }) => {
  try {
    const { terms } = await TermsService.getTerms();

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        terms,
      },
    };
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {
      notFound: true,
    };
  }
};
