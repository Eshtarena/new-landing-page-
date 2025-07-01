import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BannersSection from "../sections/BannersSection";
import AboutSection from "../sections/AboutSection";
import DealsSection from "../sections/DealsSection";
import ContactSection from "../sections/ContactSection";
import SuppliersRequests from "../sections/SuppliersRequests";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchSocialLinks } from "../utils/api";
import Head from "next/head";

export default function Home() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [socialData, setSocialData] = useState({
    social: [],
    apple: "",
    google: "",
  });

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch social links once at the top level
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await fetchSocialLinks();
        setSocialData(data);
      } catch (error) {
        console.error("Error loading social links:", error);
      }
    };

    loadSocialLinks();
  }, []);

  // Handle smooth scrolling when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const navbarHeight = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    // Handle initial hash on page load with a delay
    if (router.asPath.includes("#")) {
      setTimeout(handleHashChange, 100);
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [router.asPath]);

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
          }
        `,
          }}
        />
      </Head>
      <div className={`min-h-screen   `}>
        <Navbar />
        <main>
          {/* Banner Section */}
          <BannersSection />

          {/* About Section */}
          <AboutSection socialData={socialData} />

          {/* Deals Section */}
          <DealsSection />

          {/* Suppliers Requests Section */}
          <SuppliersRequests />

          {/* Contact Section */}
          <ContactSection socialData={socialData} />
        </main>
        <Footer socialData={socialData} />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
