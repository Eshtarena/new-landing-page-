import { API_BASE_URL, API_ENDPOINTS } from "./config";

export interface SocialLink {
  _id: string;
  title: string;
  logo: string;
  link: string;
  createdAt?: string;
}

export function isXPlatformSocialLink(
  social: Pick<SocialLink, "title" | "link">
): boolean {
  const title = social.title?.toLowerCase() ?? "";
  const link = social.link?.toLowerCase() ?? "";
  return (
    title === "x" ||
    title === "twitter" ||
    link.includes("x.com") ||
    link.includes("twitter.com")
  );
}

export interface SocialLinksData {
  social: SocialLink[];
  apple: string;
  google: string;
}

interface AboutLinksResponse {
  about?: {
    social?: SocialLink[];
    apple?: string;
    google?: string;
  };
}

export class SocialService {
  static async getLinks(): Promise<SocialLinksData> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SOCIAL_LINKS}`);
      if (!response.ok) {
        throw new Error("Failed to fetch social links");
      }

      const data: AboutLinksResponse = await response.json();
      const aboutData = data.about || {};
      const socialWithLogos: SocialLink[] = (aboutData.social || []).map((item) => ({
        ...item,
        logo: `${API_BASE_URL}/public/advice/${item.logo}`,
      }));

      return {
        social: socialWithLogos,
        apple: aboutData.apple || "",
        google: aboutData.google || "",
      };
    } catch (error) {
      console.error("Error fetching social links:", error);
      return {
        social: [],
        apple: "",
        google: "",
      };
    }
  }
}
