import type { Deal } from "./deals";

export interface SupplierBranch {
  id: string;
  title: string;
  location: string;
  lat?: string;
  lng?: string;
  openAt?: string;
  closeAt?: string;
  city?: string;
  districts: string[];
  /** Populated when the API provides branch headcount. */
  employees?: number;
}

export interface SupplierCityCoverage {
  city: string;
  districts: string[];
}

// UI-facing supplier type. Components only ever see this shape — never the raw API payload.
export interface Supplier {
  id: string;
  name_en: string;
  name_ar: string;
  logoUrl: string;
  link: string;
  /** Only populated by the single-supplier detail fetch, not the list. */
  overview_en?: string;
  overview_ar?: string;
  founded?: string;
  website?: string;
  phone?: string[];
  facebook?: string;
  twitter?: string;
  linkedIn?: string;
  categories?: string[];
  allKsa?: boolean;
  cities?: SupplierCityCoverage[];
  branches?: SupplierBranch[];
}

export interface SupplierDetail {
  supplier: Supplier;
  originalDeals: Deal[];
  coldDeals: Deal[];
  voucherDeals: Deal[];
}
