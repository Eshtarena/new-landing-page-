import {
  API_BASE_URL,
  API_ENDPOINTS,
  fetchWithOptionalAuth,
  handleApiResponse,
  createApiError,
  resolvePublicAsset,
} from "./config";
import type {
  AdviceArticle,
  AdviceListParams,
  AdviceListResponse,
} from "../types/advice";

interface RawHomeAdviceAdvisor {
  name_en?: string;
  name_ar?: string;
  role?: string;
  pic?: string;
}

// Raw shape of an Advice item inside GET /v1/user/home?type=Advice.
interface RawHomeAdviceItem {
  _id: string;
  title_en?: string;
  title_ar?: string;
  advice_en?: string;
  advice_ar?: string;
  pic?: string | string[];
  advisor?: RawHomeAdviceAdvisor;
  likes?: number;
  shares?: number;
}

interface RawHomeResponse {
  home: Array<{ type: string; deal?: RawHomeAdviceItem; advice?: RawHomeAdviceItem }>;
}

// Raw shape of GET /v1/user/advice/:_id — requires auth, so guests will typically 401 here.
interface RawAdviceDetail {
  uuid?: number;
  pic?: string | string[];
  title_en: string;
  title_ar: string;
  advice_en: string;
  advice_ar: string;
  startDateTime?: string;
  advisor?: RawHomeAdviceAdvisor;
  likes?: number;
  shares?: number;
}

interface RawAdviceDetailResponse {
  advice: RawAdviceDetail;
}

function truncate(html: string | undefined, maxLength = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

function estimateReadTime(html: string | undefined): number {
  const words = (html || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function firstPicFilename(pic?: string | string[]): string | undefined {
  if (!pic) return undefined;
  return Array.isArray(pic) ? pic[0] : pic;
}

/**
 * There is no guest-accessible list endpoint (GET /v1/advice is staff-only) and no slug on
 * the backend. Cards are sourced from GET /v1/user/home?type=Advice; category stays
 * hardcoded to "deals" because the backend taxonomy doesn't map onto this UI's enum.
 */
export function mapHomeAdviceToArticle(raw: RawHomeAdviceItem): AdviceArticle {
  const productPic = firstPicFilename(raw.pic);
  const productImageUrl = resolvePublicAsset("advice", productPic) || undefined;

  return {
    id: raw._id,
    slug: raw._id,
    category: "deals",
    title_en: raw.title_en || "",
    title_ar: raw.title_ar || "",
    excerpt_en: truncate(raw.advice_en),
    excerpt_ar: truncate(raw.advice_ar),
    content_en: raw.advice_en || "",
    content_ar: raw.advice_ar || "",
    imageUrl: productImageUrl,
    productImageUrl,
    readTimeMinutes: estimateReadTime(raw.advice_en),
    publishedAt: new Date().toISOString(),
    author_en: raw.advisor?.name_en || "",
    author_ar: raw.advisor?.name_ar || "",
    advisorTitle_en: raw.advisor?.role || undefined,
    advisorTitle_ar: raw.advisor?.role || undefined,
    advisorAvatarUrl:
      resolvePublicAsset("advisor", raw.advisor?.pic) || undefined,
    likesCount: raw.likes ?? 0,
    sharesCount: raw.shares ?? 0,
  };
}

export function mapAdviceDetailToArticle(id: string, raw: RawAdviceDetail): AdviceArticle {
  const productPic = firstPicFilename(raw.pic);
  const productImageUrl = resolvePublicAsset("advice", productPic) || undefined;

  return {
    id,
    slug: id,
    category: "deals",
    title_en: raw.title_en || "",
    title_ar: raw.title_ar || "",
    excerpt_en: truncate(raw.advice_en),
    excerpt_ar: truncate(raw.advice_ar),
    content_en: raw.advice_en || "",
    content_ar: raw.advice_ar || "",
    imageUrl: productImageUrl,
    productImageUrl,
    readTimeMinutes: estimateReadTime(raw.advice_en),
    publishedAt: raw.startDateTime || new Date().toISOString(),
    author_en: raw.advisor?.name_en || "",
    author_ar: raw.advisor?.name_ar || "",
    advisorTitle_en: raw.advisor?.role || undefined,
    advisorTitle_ar: raw.advisor?.role || undefined,
    advisorAvatarUrl:
      resolvePublicAsset("advisor", raw.advisor?.pic) || undefined,
    likesCount: raw.likes ?? 0,
    sharesCount: raw.shares ?? 0,
  };
}

export class AdviceService {
  static async getArticles(params: AdviceListParams = {}): Promise<AdviceListResponse> {
    try {
      const query = new URLSearchParams();
      query.set("type", "Advice");
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("size", String(params.limit));

      const response = await fetchWithOptionalAuth(`${API_ENDPOINTS.HOME}?${query.toString()}`);
      const data = await handleApiResponse<RawHomeResponse>(response);

      const articles = (data.home || [])
        .map((item) => item.advice || item.deal)
        .filter((item): item is RawHomeAdviceItem => Boolean(item))
        .map(mapHomeAdviceToArticle);

      return { message: "success", articles };
    } catch (error) {
      console.error("Error fetching advice articles:", error);
      return { message: "success", articles: [] };
    }
  }

  /**
   * The detail endpoint requires a Bearer token and this app has no login flow, so guest
   * calls will typically 401. Callers must handle the rejection with an auth-gate/CTA state
   * rather than assuming this always resolves.
   */
  static async getArticleBySlug(slug: string): Promise<AdviceArticle> {
    try {
      const response = await fetchWithOptionalAuth(`${API_BASE_URL}${API_ENDPOINTS.ADVICE}/${slug}`);
      const data = await handleApiResponse<RawAdviceDetailResponse>(response);
      return mapAdviceDetailToArticle(slug, data.advice);
    } catch (error) {
      throw createApiError(
        error instanceof Error ? error.message : "Failed to fetch advice article"
      );
    }
  }
}
