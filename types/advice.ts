export type AdviceCategory =
  | "savings"
  | "deals"
  | "shopping"
  | "vouchers";

export interface AdviceArticle {
  id: string;
  slug: string;
  category: AdviceCategory;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  imageUrl?: string;
  productImageUrl?: string;
  readTimeMinutes: number;
  publishedAt: string;
  author_en: string;
  author_ar: string;
  advisorTitle_en?: string;
  advisorTitle_ar?: string;
  advisorAvatarUrl?: string;
  categoryName_en?: string;
  categoryName_ar?: string;
  categoryImageUrl?: string;
  likesCount?: number;
  sharesCount?: number;
}

export interface AdviceListResponse {
  message: string;
  articles: AdviceArticle[];
}

export interface AdviceListParams {
  category?: AdviceCategory | "all";
  page?: number;
  limit?: number;
}

export interface AdviceArticleResponse {
  message: string;
  article: AdviceArticle;
}
