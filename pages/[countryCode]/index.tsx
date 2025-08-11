import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import CategoryMenu from "../../components/ecommerce/CategoryMenu";
import PromoBanner from "../../components/ecommerce/PromoBanner";
import HeroSlider from "../../components/ecommerce/HeroSlider";
import CategoryShortcuts from "../../components/ecommerce/CategoryShortcuts";
import FeaturedDeals from "../../components/ecommerce/FeaturedDeals";
import MegaDeals from "../../components/ecommerce/MegaDeals";
import NotFoundPage from "../../components/NotFoundPage";

interface CountryNames {
  [key: string]: string;
}

interface Props {
  countryCode: string;
}

const countryNames: CountryNames = {
  egy: "Egypt",
  saudi: "Saudi Arabia",
};

export default function CountryHomePage({ countryCode }: Props) {
  const router = useRouter();

  // Determine language from router or default to 'en'
  const lang = router.locale || "en";

  return (
    <>
      <Head>
        <title>
          Eshtarena - {countryNames[countryCode] || countryCode?.toUpperCase()}
        </title>
        <meta
          name="description"
          content="Your one-stop shop for all your needs"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <MainNavbar countryCode={countryCode} lang={lang} />
        {/* <CategoryMenu /> */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSlider />
          <CategoryShortcuts />
          <MegaDeals />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { countryCode } = params as { countryCode: string };

  // Validate country code
  const validCountries = ["egy", "saudi"];
  if (!validCountries.includes(countryCode?.toLowerCase())) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      countryCode: countryCode.toLowerCase(),
    },
  };
};
