import { API_ENDPOINTS, fetchWithOptionalAuth, handleApiResponse, resolvePublicAsset } from "./config";
import type { Category } from "../types/category";

// Raw shape of GET /v1/user/categories, verified against the backend controller.
interface RawCategory {
  _id: string;
  name_en: string;
  name_ar: string;
  categoryImg?: string;
  displayOrder?: number;
}

interface CategoriesResponse {
  totalPages: number;
  currentPage: number;
  total: number;
  categories: RawCategory[];
}

/** No slug exists on categories — routes are built from `_id`. */
export function mapCategory(category: RawCategory): Category {
  return {
    id: category._id,
    name_en: category.name_en,
    name_ar: category.name_ar,
    iconUrl: resolvePublicAsset("category", category.categoryImg),
    link: `/store?category=${category._id}`,
    order: category.displayOrder ?? 0,
  };
}

export class CategoriesService {
  static async getCategories(): Promise<Category[]> {
    const response = await fetchWithOptionalAuth(API_ENDPOINTS.CATEGORIES);
    const data = await handleApiResponse<CategoriesResponse>(response);

    return (data.categories || [])
      .map(mapCategory)
      .sort((a, b) => a.order - b.order);
  }
}
