import { useRouter } from 'next/router';
import Head from 'next/head';
import MainNavbar from '../../components/ecommerce/MainNavbar';
import CategoryMenu from '../../components/ecommerce/CategoryMenu';
import PromoBanner from '../../components/ecommerce/PromoBanner';
import HeroSlider from '../../components/ecommerce/HeroSlider';
import CategoryShortcuts from '../../components/ecommerce/CategoryShortcuts';
import FeaturedDeals from '../../components/ecommerce/FeaturedDeals';
import MegaDeals from '../../components/ecommerce/MegaDeals';

const countryNames = {
  egy: 'Egypt',
  saudi: 'Saudi Arabia'
};

export default function CountryHomePage() {
  const router = useRouter();
  const { countryCode } = router.query;

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
          <PromoBanner />
          <HeroSlider />
          <CategoryShortcuts />
          <FeaturedDeals />
          <MegaDeals />
        </main>
      </div>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({ params }) {
  const { countryCode } = params;
  
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
} 