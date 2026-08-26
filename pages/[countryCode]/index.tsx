import React, { useCallback, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import HeroSlider from "../../components/ecommerce/HeroSlider";
import CategoryShortcuts from "../../components/ecommerce/CategoryShortcuts";
import SupplierMarquee from "../../components/ecommerce/SupplierMarquee";
import MegaDeals from "../../components/ecommerce/MegaDeals";
import SiteFooter from "../../components/SiteFooter";

interface CountryNames {
  [key: string]: string;
}

interface Props {
  countryCode: string;
}

const countryNames: CountryNames = {
  saudi: "Saudi Arabia",
};

export default function CountryHomePage({ countryCode }: Props) {
  const router = useRouter();
  const lang = router.locale || "en";
  const [openMobileFilter, setOpenMobileFilter] = useState<(() => void) | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegisterMobileFilter = useCallback((openFilter: () => void) => {
    setOpenMobileFilter(() => openFilter);
  }, []);

  return (
    <>
      <Head>
        <title>{`Sharena - ${countryNames[countryCode] || countryCode?.toUpperCase()}`}</title>
        <meta
          name="description"
          content="Your one-stop shop for all your needs"
        />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <MainNavbar
          countryCode={countryCode}
          lang={lang}
          onMobileFilterOpen={openMobileFilter ?? undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 w-full min-w-0">
          {!searchQuery.trim() && (
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
              <HeroSlider />
              <SupplierMarquee />
              <CategoryShortcuts />
            </div>
          )}
          <MegaDeals
            onRegisterMobileFilter={handleRegisterMobileFilter}
            search={searchQuery}
            showMobileBottomNav={false}
            showAdviceSection
          />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const { countryCode } = params as { countryCode: string };

  // Validate country code
  const validCountries = ["saudi"];
  if (!validCountries.includes(countryCode?.toLowerCase())) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      countryCode: countryCode.toLowerCase(),
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
