/**
 * Shared API response types for cold and original deal details.
 * Cold: GET /v1/user/cold-details/:_id
 * Original: GET /v1/user/orginal-details/:_id
 */

export interface DealDetailsApiSupplier {
  _id: string;
  name_en: string;
  name_ar: string;
  pic?: string;
}

/** Common deal fields returned by cold-details and original-details APIs */
export interface DealDetailsApiDeal {
  _id: string;
  title_en: string;
  title_ar: string;
  status: string; // "On going" | "Ended" (or similar)
  quantity: number;
  sold: number;
  /** Single image (voucher-style); used when only one image */
  pic?: string;
  /** Multiple images (cold/original may have more than one) */
  pics?: string[];
  images?: string[];
  endDate?: string;
  supplier?: DealDetailsApiSupplier;
  dealPrice: number;
  save: number;
  marketPrice?: number;
  allKsa?: boolean;
  districts?: unknown[];
  cities?: unknown[];
  /** Optional about/description content */
  about?: { content_en?: string; content_ar?: string };
  /** Short deal-specific specs shown in the deal tab accordion. */
  specialSpecification?: string;
  product?: {
    name_en?: string;
    name_ar?: string;
    description_en?: string;
    description_ar?: string;
    factory_en?: string;
    factory_ar?: string;
  country_en?: string;
  country_ar?: string;
  pic?: string[];
    vat?: number;
  };
  color?: unknown;
  size?: unknown;
  [key: string]: unknown;
}

export interface ColdDetailsApiResponse {
  cold?: DealDetailsApiDeal;
  coldDeal?: DealDetailsApiDeal;
  /** Some APIs return the deal at top level */
  _id?: string;
  title_en?: string;
  title_ar?: string;
  status?: string;
  quantity?: number;
  sold?: number;
  dealPrice?: number;
  save?: number;
  marketPrice?: number;
  endDate?: string;
  supplier?: DealDetailsApiSupplier;
  pic?: string;
  allKsa?: boolean;
}

export interface OriginalDetailsApiResponse {
  original?: DealDetailsApiDeal;
  originalDeal?: DealDetailsApiDeal;
  _id?: string;
  title_en?: string;
  title_ar?: string;
  status?: string;
  quantity?: number;
  sold?: number;
  dealPrice?: number;
  save?: number;
  marketPrice?: number;
  endDate?: string;
  supplier?: DealDetailsApiSupplier;
  pic?: string;
  allKsa?: boolean;
}
