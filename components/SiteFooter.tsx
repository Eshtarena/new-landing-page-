import { useEffect, useState } from "react";
import Footer from "./landingpage/Footer";
import { SocialService, type SocialLinksData } from "../services";

/**
 * Footer wrapper for pages that don't already fetch social links
 * (store, deal details, legal pages). Renders the same landing-page
 * Footer so the site chrome is identical everywhere.
 */
export default function SiteFooter() {
  const [socialData, setSocialData] = useState<SocialLinksData>({
    social: [],
    apple: "",
    google: "",
  });

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

  return <Footer socialData={socialData} />;
}
