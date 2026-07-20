import { API_BASE_URL, API_ENDPOINTS, handleApiResponse, resolvePublicAsset } from "./config";
import type { Banner } from "../types/banner";

// Raw shape of GET /v1/public/ads, verified against the backend controller.
interface RawAd {
  _id: string;
  uuid?: number;
  title_en?: string;
  title_ar?: string;
  link: string;
  pic: string;
  /** Optional mobile-breakpoint image; not every ad has one. */
  mobPic?: string | null;
  startDate?: string;
  endDate?: string;
  status: string;
}

interface AdsResponse {
  totalPages: number;
  currentPage: number;
  total: number;
  ads: RawAd[];
}

/** There is only one image per ad — same URL is used for both locales. */
export function mapAdToBanner(ad: RawAd, index: number): Banner {
  const imageUrl = resolvePublicAsset("ads", ad.pic);
  const mobileImageUrl = ad.mobPic ? resolvePublicAsset("ads", ad.mobPic) : null;
  return {
    id: ad._id,
    imageUrl_en: imageUrl,
    imageUrl_ar: imageUrl,
    mobileImageUrl,
    linkUrl: ad.link || "#",
    order: index,
    isActive: ad.status === "Running",
    title_en: ad.title_en,
    title_ar: ad.title_ar,
  };
}

export class BannersService {
  static async getBanners(params: { page?: number; size?: number } = {}): Promise<Banner[]> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("size", String(params.size ?? 20));

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC_ADS}?${query.toString()}`);
    const data = await handleApiResponse<AdsResponse>(response);

    return (data.ads || [])
      .map(mapAdToBanner)
      .filter((banner) => banner.isActive);
  }
}
