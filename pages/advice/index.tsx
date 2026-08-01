import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Head from "next/head";
import Navbar from "../../components/landingpage/Navbar";
import SiteFooter from "../../components/SiteFooter";
import AdviceList from "../../components/advice/AdviceList";
import { AdviceService } from "../../services";
import type { AdviceArticle } from "../../types/advice";

interface AdvicePageProps {
  articles: AdviceArticle[];
}

export default function AdvicePage({ articles }: AdvicePageProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{`${t("advice.pageTitle")} | Sharena`}</title>
        <meta name="description" content={t("advice.pageDescription")} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <header className="bg-primary-500 pt-28 sm:pt-32 pb-12 sm:pb-16 md:pt-40 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white text-center">
              {t("advice.pageTitle")}
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/80 text-center max-w-3xl mx-auto">
              {t("advice.pageDescription")}
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <AdviceList articles={articles} />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<AdvicePageProps> = async ({
  locale = "en",
}) => {
  const { articles } = await AdviceService.getArticles();

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      articles,
    },
  };
};
