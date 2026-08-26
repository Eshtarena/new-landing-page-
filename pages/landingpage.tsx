import React, { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import Navbar from "../components/landingpage/Navbar";
import Footer from "../components/landingpage/Footer";
import BannersSection from "../components/landingpage/BannersSection";
import AboutSection from "../components/landingpage/AboutSection";
import DealsSection from "../components/landingpage/DealsSection";
import ContactSection from "../components/landingpage/ContactSection";
import SuppliersRequests from "../components/landingpage/SuppliersRequests";
import { SocialService, type SocialLinksData } from "../services";

export default function LandingPage() {
  const { i18n } = useTranslation("common");
  const router = useRouter();
  const [socialData, setSocialData] = useState<SocialLinksData>({
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
        const data = await SocialService.getLinks();
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
    <div className={`min-h-screen ${i18n.language === "ar" ? "rtl" : "ltr"}`}>
        <Navbar />
        <main>
          {/* Banner Section */}
          <BannersSection />

          {/* About Section */}
          <AboutSection />

          {/* Deals Section */}
          <DealsSection />

          {/* Suppliers Requests Section */}
          <SuppliersRequests />
        {/*  */}
          {/* Contact Section */}
          <ContactSection socialData={socialData} />
        </main>
        <Footer socialData={socialData} />
      </div>
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale,
}: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
