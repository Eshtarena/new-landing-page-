import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MainNavbar from '../../components/ecommerce/MainNavbar';
import CategoryMenu from '../../components/ecommerce/CategoryMenu';
import PromoBanner from '../../components/ecommerce/PromoBanner';
import HeroSlider from '../../components/ecommerce/HeroSlider';
import CategoryShortcuts from '../../components/ecommerce/CategoryShortcuts';
import FeaturedDeals from '../../components/ecommerce/FeaturedDeals';
import MegaDeals from '../../components/ecommerce/MegaDeals';

interface CountryNames {
  [key: string]: string;
}

interface Props {
  countryCode: string;
}

const countryNames: CountryNames = {
  egy: 'Egypt',
  saudi: 'Saudi Arabia'
};

export default function CountryHomePage({ countryCode }: Props) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Eshtarena - {countryNames[countryCode] || countryCode?.toUpperCase()}</title>
        <meta name="description" content="Your one-stop shop for all your needs" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <MainNavbar />
        <CategoryMenu />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <PromoBanner /> */}
          <HeroSlider />
          <CategoryShortcuts />
          <FeaturedDeals />
          <MegaDeals />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { countryCode } = params as { countryCode: string };
  
  // Validate country code
  const validCountryCodes = ['egy', 'saudi'];
  
  if (!validCountryCodes.includes(countryCode.toLowerCase())) {
    return {
      notFound: true, // This will show your 404 page
    };
  }

  return {
    props: {
      countryCode: countryCode.toLowerCase(),
    },
  };
}; 