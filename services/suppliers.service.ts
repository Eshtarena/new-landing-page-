import {
  API_BASE_URL,
  API_ENDPOINTS,
  fetchWithOptionalAuth,
  handleApiResponse,
  resolvePublicAsset,
} from "./config";
import { computeCountdownParts } from "./deals.service";
import type { ColdDeal, Deal, OriginalDeal, VoucherDeal } from "../types/deals";
import type {
  Supplier,
  SupplierBranch,
  SupplierCityCoverage,
  SupplierDetail,
} from "../types/supplier";

type Locale = "en" | "ar";

const ALL_KSA_TEXT: Record<Locale, string> = { en: "All KSA", ar: "جميع أنحاء المملكة" };
const SELECTED_CITIES_TEXT: Record<Locale, string> = { en: "Selected cities", ar: "مدن مختارة" };

function pickLocale(en: string | undefined, ar: string | undefined, locale: Locale): string {
  return (locale === "ar" ? ar : en) || en || ar || "";
}

function dealImageFolder(dealType: "original" | "cold" | "voucher"): string {
  return dealType === "voucher" ? "voucher" : "product";
}

function toImages(pics: string[] | undefined, alt: string, folder: string) {
  return (pics || [])
    .map((pic) => resolvePublicAsset(folder, pic))
    .filter(Boolean)
    .map((src) => ({ src, alt }));
}

function defaultQuantity(quantity?: number, sold?: number) {
  const safeSold = sold ?? 0;
  const safeQuantity = quantity ?? safeSold;
  return { sold: safeSold, available: Math.max(0, safeQuantity - safeSold) };
}

// Raw shape of GET /v1/user/suppliers, verified against the live backend.
interface RawSupplierListItem {
  _id: string;
  uuid?: number;
  name_en: string;
  name_ar: string;
  overview_en?: string;
  overview_ar?: string;
  pic?: string;
  displayOrder?: number;
  categories?: string[];
}

interface RawSuppliersResponse {
  totalPages: number;
  currentPage: number;
  total: number;
  suppliers: RawSupplierListItem[];
}

interface RawDistrict {
  district_en?: string;
  district_ar?: string;
}

interface RawCityRef {
  city_en?: string;
  city_ar?: string;
}

interface RawSupplierCity {
  city?: RawCityRef;
  districts?: RawDistrict[];
}

interface RawSupplierBranch {
  _id: string;
  title_en?: string;
  title_ar?: string;
  location_en?: string;
  location_ar?: string;
  lat?: string;
  lng?: string;
  openAt?: string;
  closeAt?: string;
  employees?: number;
  area?: RawCityRef;
  districts?: RawDistrict[];
}

interface RawSupplierDetail {
  _id: string;
  name_en: string;
  name_ar: string;
  overview_en?: string;
  overview_ar?: string;
  founded?: string;
  pic?: string;
  phone?: string[];
  facebook?: string;
  twitter?: string;
  linkedIn?: string;
  website?: string;
  allKsa?: boolean;
  cities?: RawSupplierCity[];
  branches?: RawSupplierBranch[];
  categories?: { item: { _id: string; name_en: string; name_ar: string } }[];
}

interface RawSupplierDealBase {
  _id: string;
  title_en: string;
  title_ar: string;
  pic?: string[];
  endDate: string;
  allKsa?: boolean;
  quantity?: number;
  sold?: number;
  dealPrice: number;
  save: number;
}

interface RawSupplierOriginalDeal extends RawSupplierDealBase {
  product_en?: string;
  product_ar?: string;
  marketPrice?: number;
}

interface RawSupplierColdDeal extends RawSupplierDealBase {
  product_en?: string;
  product_ar?: string;
  marketPrice?: number;
}

interface RawSupplierVoucherDeal extends RawSupplierDealBase {
  voucherValue?: number;
}

interface RawSupplierDetailResponse {
  supplier: RawSupplierDetail;
  originalDeals?: RawSupplierOriginalDeal[];
  coldDeals?: RawSupplierColdDeal[];
  voucherDeals?: RawSupplierVoucherDeal[];
}

function mapCityCoverage(cities: RawSupplierCity[] | undefined, locale: Locale): SupplierCityCoverage[] {
  return (cities || [])
    .map((entry) => {
      const city = pickLocale(entry.city?.city_en, entry.city?.city_ar, locale);
      if (!city) return null;
      const districts = (entry.districts || [])
        .map((district) => pickLocale(district.district_en, district.district_ar, locale))
        .filter(Boolean);
      return { city, districts };
    })
    .filter((entry): entry is SupplierCityCoverage => entry !== null);
}

function mapBranches(branches: RawSupplierBranch[] | undefined, locale: Locale): SupplierBranch[] {
  return (branches || []).map((branch) => ({
    id: branch._id,
    title: pickLocale(branch.title_en, branch.title_ar, locale),
    location: pickLocale(branch.location_en, branch.location_ar, locale),
    lat: branch.lat,
    lng: branch.lng,
    openAt: branch.openAt,
    closeAt: branch.closeAt,
    employees: branch.employees,
    city: pickLocale(branch.area?.city_en, branch.area?.city_ar, locale) || undefined,
    districts: (branch.districts || [])
      .map((district) => pickLocale(district.district_en, district.district_ar, locale))
      .filter(Boolean),
  }));
}

function mapSupplierDealBase(
  raw: RawSupplierDealBase,
  dealType: "original" | "cold" | "voucher",
  locale: Locale,
  supplierMeta: Pick<Supplier, "id" | "name_en" | "name_ar" | "logoUrl">
) {
  const title = pickLocale(raw.title_en, raw.title_ar, locale);
  const supplierName = pickLocale(supplierMeta.name_en, supplierMeta.name_ar, locale);

  return {
    id: raw._id,
    title,
    images: toImages(raw.pic, title, dealImageFolder(dealType)),
    timer: computeCountdownParts(raw.endDate),
    location: {
      text: raw.allKsa ? ALL_KSA_TEXT[locale] : SELECTED_CITIES_TEXT[locale],
    },
    quantity: defaultQuantity(raw.quantity, raw.sold),
    dealPrice: raw.dealPrice,
    saveAmount: raw.save,
    currency: "SAR",
    isActive: true,
    supplier: supplierName,
    supplierLogo: supplierMeta.logoUrl || undefined,
    supplierId: supplierMeta.id,
  };
}

function mapOriginalDeal(
  raw: RawSupplierOriginalDeal,
  locale: Locale,
  supplierMeta: Pick<Supplier, "id" | "name_en" | "name_ar" | "logoUrl">
): OriginalDeal {
  const productName = pickLocale(raw.product_en, raw.product_ar, locale) || undefined;
  return {
    ...mapSupplierDealBase(raw, "original", locale, supplierMeta),
    dealType: "original",
    description: productName,
    productName,
    marketPrice: raw.marketPrice ?? raw.dealPrice,
  };
}

function mapColdDeal(
  raw: RawSupplierColdDeal,
  locale: Locale,
  supplierMeta: Pick<Supplier, "id" | "name_en" | "name_ar" | "logoUrl">
): ColdDeal {
  const productName = pickLocale(raw.product_en, raw.product_ar, locale) || undefined;
  return {
    ...mapSupplierDealBase(raw, "cold", locale, supplierMeta),
    dealType: "cold",
    description: productName,
    productName,
    marketPrice: raw.marketPrice ?? raw.dealPrice,
  };
}

function mapVoucherDeal(
  raw: RawSupplierVoucherDeal,
  locale: Locale,
  supplierMeta: Pick<Supplier, "id" | "name_en" | "name_ar" | "logoUrl">
): VoucherDeal {
  return {
    ...mapSupplierDealBase(raw, "voucher", locale, supplierMeta),
    dealType: "voucher",
    voucherValue: raw.voucherValue ?? 0,
  };
}

export function mapSupplierListItem(supplier: RawSupplierListItem): Supplier {
  return {
    id: supplier._id,
    name_en: supplier.name_en,
    name_ar: supplier.name_ar,
    logoUrl: resolvePublicAsset("supplier", supplier.pic),
    link: `/supplier-details/${supplier._id}`,
    overview_en: supplier.overview_en,
    overview_ar: supplier.overview_ar,
    categories: supplier.categories,
  };
}

export function mapSupplierDetail(supplier: RawSupplierDetail, locale: Locale): Supplier {
  return {
    id: supplier._id,
    name_en: supplier.name_en,
    name_ar: supplier.name_ar,
    logoUrl: resolvePublicAsset("supplier", supplier.pic),
    link: `/supplier-details/${supplier._id}`,
    overview_en: supplier.overview_en,
    overview_ar: supplier.overview_ar,
    founded: supplier.founded,
    website: supplier.website,
    phone: supplier.phone,
    facebook: supplier.facebook,
    twitter: supplier.twitter,
    linkedIn: supplier.linkedIn,
    categories: (supplier.categories || [])
      .map((c) => pickLocale(c.item?.name_en, c.item?.name_ar, locale))
      .filter(Boolean),
    allKsa: supplier.allKsa,
    cities: mapCityCoverage(supplier.cities, locale),
    branches: mapBranches(supplier.branches, locale),
  };
}

export function mapSupplierDetailResponse(data: RawSupplierDetailResponse, locale: Locale): SupplierDetail {
  const supplier = mapSupplierDetail(data.supplier, locale);
  const supplierMeta = {
    id: supplier.id,
    name_en: supplier.name_en,
    name_ar: supplier.name_ar,
    logoUrl: supplier.logoUrl,
  };

  return {
    supplier,
    originalDeals: (data.originalDeals || []).map((deal) => mapOriginalDeal(deal, locale, supplierMeta)),
    coldDeals: (data.coldDeals || []).map((deal) => mapColdDeal(deal, locale, supplierMeta)),
    voucherDeals: (data.voucherDeals || []).map((deal) => mapVoucherDeal(deal, locale, supplierMeta)),
  };
}

export class SuppliersService {
  static async getSuppliers(): Promise<Supplier[]> {
    const response = await fetchWithOptionalAuth(API_ENDPOINTS.SUPPLIERS);
    const data = await handleApiResponse<RawSuppliersResponse>(response);

    return (data.suppliers || [])
      .slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(mapSupplierListItem);
  }

  /** Guest-accessible route — returns the full storefront payload in one call. */
  static async getPublicSupplierDetail(
    id: string,
    locale: Locale = "en",
    limit = 20
  ): Promise<SupplierDetail> {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PUBLIC_SUPPLIER_DETAIL(id)}?limit=${safeLimit}`
    );
    const data = await handleApiResponse<RawSupplierDetailResponse>(response);
    return mapSupplierDetailResponse(data, locale);
  }
}
