import React from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Term } from "../../types/terms";
import { TermsService } from "../../services";
import Navbar from "../../components/landingpage/Navbar";
import SiteFooter from "../../components/SiteFooter";

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
        <title>{`${t("terms.pageTitle")} | Eshtarena`}</title>
        <meta name="description" content={t("terms.pageDescription")} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Header — dark band so the floating glass navbar stays legible */}
        <header className="bg-primary-500 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center">
              {t("terms.pageTitle")}
            </h1>

            {/* Page Description */}
            <p className="mt-4 text-lg md:text-xl text-white/80 text-center max-w-3xl mx-auto">
              {t("terms.pageDescription")}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {terms.map((term) => (
            <div
              key={term._id}
              className="bg-white rounded-2xl shadow-soft border border-black/5 w-full mb-8 last:mb-0"
            >
              <div className="p-6 md:p-8">
                <h2
                  className="text-2xl font-bold tracking-tight text-primary-500 mb-4"
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
        </main>

        <SiteFooter />
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
