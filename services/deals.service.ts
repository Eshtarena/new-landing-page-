import { API_BASE_URL, API_ENDPOINTS, ApiError, fetchWithOptionalAuth, handleApiResponse, resolvePublicAsset } from "./config";
import type {
  Deal,
  DealTimer,
  DealType,
  VoucherDeal,
  ColdDeal,
  OriginalDeal,
  DealImage,
  DealDetailContent,
  DealTermItem,
} from "../types/deals";

export type Locale = "en" | "ar";

const BACKEND_DEAL_TYPE: Record<DealType, string> = {
  voucher: "Voucher Deal",
  original: "Original Deal",
  cold: "Cold Deal",
};

const UI_DEAL_TYPE: Record<string, DealType> = {
  "Voucher Deal": "voucher",
  "Gift Voucher Deal": "voucher",
  "Original Deal": "original",
  "Cold Deal": "cold",
};

function resolvePublicDealType(
  data: RawPublicDealDetailResponse,
  hintDealType?: DealType | null
): DealType | null {
  const mapped = UI_DEAL_TYPE[data.type];
  if (mapped) return mapped;
  if (data.voucher) return "voucher";
  if (hintDealType) return hintDealType;
  if (data.deal) {
    if (/cold/i.test(data.type)) return "cold";
    if (/original|product|area/i.test(data.type)) return "original";
  }
  return null;
}

const ALL_KSA_TEXT: Record<Locale, string> = { en: "All KSA", ar: "جميع أنحاء المملكة" };
const SELECTED_CITIES_TEXT: Record<Locale, string> = { en: "Selected cities", ar: "مدن مختارة" };

/**
 * The backend sends a full ISO `endDate`, but CountdownTimer (and the rest of the UI)
 * expects an already-decomposed { days, hours, minutes, seconds } snapshot. This computes
 * that snapshot once at fetch time; CountdownTimer ticks it down client-side from there.
 */
export function computeCountdownParts(endDateIso: string): DealTimer {
  const diffMs = Math.max(0, new Date(endDateIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pickLocale(en: string | undefined, ar: string | undefined, locale: Locale): string {
  return (locale === "ar" ? ar : en) || en || ar || "";
}

function pickAboutContent(
  about: { content_en?: string; content_ar?: string } | undefined,
  locale: Locale
): string | undefined {
  if (!about) return undefined;
  return pickLocale(about.content_en, about.content_ar, locale) || undefined;
}

interface RawCustomerPaymentTerm {
  title_en?: string;
  title_ar?: string;
  content_en?: string;
  content_ar?: string;
  desc_en?: string;
  desc_ar?: string;
}

type LocalizedValue = string | Record<string, unknown> | unknown[] | null | undefined;

function localizedText(value: LocalizedValue, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => localizedText(item as LocalizedValue, locale))
      .filter(Boolean)
      .join("\n\n");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const en =
      record.content_en ??
      record.desc_en ??
      record.description_en ??
      record.term_en ??
      record.title_en ??
      record.en;
    const ar =
      record.content_ar ??
      record.desc_ar ??
      record.description_ar ??
      record.term_ar ??
      record.title_ar ??
      record.ar;
    return pickLocale(
      typeof en === "string" ? en : undefined,
      typeof ar === "string" ? ar : undefined,
      locale
    );
  }
  return "";
}

function localizedTextOrUndefined(value: LocalizedValue, locale: Locale): string | undefined {
  const text = localizedText(value, locale);
  return text || undefined;
}

function mapCustomerPaymentTerms(
  terms: RawCustomerPaymentTerm[] | undefined,
  locale: Locale
): DealTermItem[] {
  return (terms || [])
    .map((term) => {
      const title = pickLocale(term.title_en, term.title_ar, locale);
      const content = pickLocale(
        term.content_en ?? term.desc_en,
        term.content_ar ?? term.desc_ar,
        locale
      );
      if (!title && !content) return null;
      return { title: title || "", content: content || "" };
    })
    .filter((term): term is DealTermItem => term !== null);
}

function normalizeDeliveryTerms(terms: unknown[] | undefined, locale: Locale): string[] {
  return (terms || [])
    .map((term) => {
      if (typeof term === "string") return term;
      if (term && typeof term === "object") {
        const record = term as RawCustomerPaymentTerm;
        const title = pickLocale(record.title_en, record.title_ar, locale);
        const body = pickLocale(
          record.desc_en ?? record.content_en,
          record.desc_ar ?? record.content_ar,
          locale
        );
        if (title && body) return `${title}: ${body}`;
        return body || title || "";
      }
      return "";
    })
    .filter(Boolean);
}

function buildDetailContent(params: {
  about?: { content_en?: string; content_ar?: string };
  terms?: LocalizedValue;
  paymentTerms?: LocalizedValue;
  deliveryTerms?: unknown[];
  customerPaymentTerms?: RawCustomerPaymentTerm[];
  locale: Locale;
}): DealDetailContent | undefined {
  const about = pickAboutContent(params.about, params.locale);
  const deliveryTerms = normalizeDeliveryTerms(params.deliveryTerms, params.locale);
  const customerPaymentTerms = mapCustomerPaymentTerms(params.customerPaymentTerms, params.locale);

  const detailContent: DealDetailContent = {
    about,
    terms: localizedTextOrUndefined(params.terms, params.locale),
    paymentTerms: localizedTextOrUndefined(params.paymentTerms, params.locale),
    deliveryTerms: deliveryTerms.length ? deliveryTerms : undefined,
    customerPaymentTerms: customerPaymentTerms.length ? customerPaymentTerms : undefined,
  };

  const hasContent = Boolean(
    detailContent.about ||
      detailContent.terms ||
      detailContent.paymentTerms ||
      detailContent.deliveryTerms?.length ||
      detailContent.customerPaymentTerms?.length
  );

  return hasContent ? detailContent : undefined;
}

function defaultTimer(endDate?: string): DealTimer {
  if (!endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return computeCountdownParts(endDate);
}

function defaultQuantity(quantity?: number, sold?: number) {
  const safeSold = sold ?? 0;
  const safeQuantity = quantity ?? safeSold;
  return { sold: safeSold, available: Math.max(0, safeQuantity - safeSold) };
}

function isStatusActive(status?: string): boolean {
  if (!status) return true;
  return !/ended|closed|expired|cancelled/i.test(status);
}

function dealImageFolder(dealType: DealType): string {
  return dealType === "voucher" ? "voucher" : "product";
}

function toImages(pics: string[] | undefined, alt: string, folder: string): DealImage[] {
  return (pics || [])
    .map((pic) => resolvePublicAsset(folder, pic))
    .filter(Boolean)
    .map((src) => ({ src, alt }));
}

// ---------------------------------------------------------------------------
// §5 Deals feed (list) — GET /v1/user/home
// ---------------------------------------------------------------------------

interface RawHomeDeal {
  _id: string;
  title_en: string;
  title_ar: string;
  pic: string[];
  product_en?: string;
  product_ar?: string;
  endDate: string;
  allKsa: boolean;
  quantity: number;
  sold: number;
  dealPrice: number;
  save: number;
  marketPrice?: number;
  voucherValue?: number;
  supplierPic?: string;
  supplierImage?: string;
  supplierNameEn?: string;
  supplierNameAr?: string;
  supplier_en?: string;
  supplier_ar?: string;
}

interface RawHomeItem {
  _id: string;
  type: string;
  deal: RawHomeDeal;
}

interface RawHomeResponse {
  totalPages: number;
  currentPage: number;
  total: number;
  home: RawHomeItem[];
}

export interface HomeFeedParams {
  page?: number;
  size?: number;
  dealTypes?: DealType[];
  minPrice?: number;
  maxPrice?: number;
  /** Backend accepts one category id per request, not a multi-value array. */
  categoryId?: string;
  /** Maps to the `location[]` param (city/district names). */
  locations?: string[];
  search?: string;
  /** When true, sends `advice=false` so the store grid excludes Advice items. */
  excludeAdvice?: boolean;
  locale: Locale;
}

export interface HomeFeedResult {
  deals: Deal[];
  totalPages: number;
  currentPage: number;
  total: number;
}

/** The list feed has no single flat shape — branch on `home[].type` before mapping. */
export function mapBackendDealToUIDeal(item: RawHomeItem, locale: Locale): Deal | null {
  const dealType = UI_DEAL_TYPE[item.type];
  if (!dealType) return null; // e.g. "Advice" items surfaced by the same feed

  const raw = item.deal;
  const title = pickLocale(raw.title_en, raw.title_ar, locale);
  const supplierPic = raw.supplierPic || raw.supplierImage;
  const base = {
    id: raw._id,
    title,
    description: pickLocale(raw.product_en, raw.product_ar, locale) || undefined,
    productName: pickLocale(raw.product_en, raw.product_ar, locale) || undefined,
    images: toImages(raw.pic, title, dealImageFolder(dealType)),
    timer: computeCountdownParts(raw.endDate),
    location: { text: raw.allKsa ? ALL_KSA_TEXT[locale] : SELECTED_CITIES_TEXT[locale] },
    quantity: { sold: raw.sold, available: Math.max(0, raw.quantity - raw.sold) },
    dealPrice: raw.dealPrice,
    saveAmount: raw.save,
    currency: "SAR",
    isActive: true,
    supplier:
      pickLocale(
        raw.supplierNameEn || raw.supplier_en,
        raw.supplierNameAr || raw.supplier_ar,
        locale
      ) || undefined,
    supplierLogo: supplierPic ? resolvePublicAsset("supplier", supplierPic) || undefined : undefined,
  };

  if (dealType === "voucher") {
    return { ...base, dealType, voucherValue: raw.voucherValue ?? 0 } as VoucherDeal;
  }
  if (dealType === "cold") {
    return { ...base, dealType, marketPrice: raw.marketPrice ?? raw.dealPrice } as ColdDeal;
  }
  return { ...base, dealType, marketPrice: raw.marketPrice ?? raw.dealPrice } as OriginalDeal;
}

function buildHomeQuery(params: HomeFeedParams): URLSearchParams {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("size", String(params.size ?? 20));

  (params.dealTypes || []).forEach((type) => {
    query.append("type", BACKEND_DEAL_TYPE[type]);
  });

  if (params.minPrice !== undefined) query.set("lowPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("highPrice", String(params.maxPrice));
  if (params.categoryId) query.append("category", params.categoryId);
  (params.locations || []).forEach((location) => query.append("location", location));
  if (params.search) query.set("search", params.search);
  if (params.excludeAdvice) query.set("advice", "false");

  // `sort` and `countryCode` are not supported by this endpoint today — intentionally omitted.
  return query;
}

// ---------------------------------------------------------------------------
// §6-8 Deal detail — voucher / original / cold
// ---------------------------------------------------------------------------

interface RawSupplier {
  _id?: string;
  name_en: string;
  name_ar: string;
  pic: string;
}

interface RawCity {
  city_en: string;
  city_ar: string;
}

interface RawVoucherDetail {
  _id?: string;
  pic: string[];
  title_en?: string;
  title_ar?: string;
  endDate?: string;
  status?: string;
  allKsa?: boolean;
  voucherValue: number;
  dealPrice: number;
  save?: number;
  quantity?: number;
  sold?: number;
  supplier?: RawSupplier;
  terms?: unknown[];
  cities?: RawCity[];
  about?: { content_en?: string; content_ar?: string };
  customerPaymentTerms?: RawCustomerPaymentTerm[];
}

interface RawVoucherDetailResponse {
  voucher: RawVoucherDetail;
}

interface RawProduct {
  marketPrice?: number;
  pic: string[];
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
}

interface RawDealDetail {
  _id: string;
  product: RawProduct;
  title_en: string;
  title_ar: string;
  endDate?: string;
  status?: string;
  allKsa?: boolean;
  dealPrice: number;
  save: number;
  quantity?: number;
  sold?: number;
  supplier?: RawSupplier;
  cities?: RawCity[];
  about?: { content_en?: string; content_ar?: string };
  deliveryTerms?: unknown[];
  paymentTerms?: LocalizedValue;
  customerPaymentTerms?: RawCustomerPaymentTerm[];
}

interface RawDealDetailResponse {
  deal: RawDealDetail;
}

interface RawPublicDealDetailResponse {
  type: string;
  deal?: RawDealDetail;
  voucher?: RawVoucherDetail;
}

function supplierName(supplier: RawSupplier | undefined, locale: Locale): string | undefined {
  if (!supplier) return undefined;
  return pickLocale(supplier.name_en, supplier.name_ar, locale) || undefined;
}

function supplierLogo(supplier: RawSupplier | undefined): string | undefined {
  if (!supplier?.pic) return undefined;
  return resolvePublicAsset("supplier", supplier.pic) || undefined;
}

function supplierId(supplier: RawSupplier | undefined): string | undefined {
  return supplier?._id || undefined;
}

function citiesLocation(
  allKsa: boolean,
  cities: RawCity[] | undefined,
  locale: Locale
): { text: string } {
  if (allKsa) return { text: ALL_KSA_TEXT[locale] };
  const names = (cities || []).map((c) => pickLocale(c.city_en, c.city_ar, locale)).filter(Boolean);
  return { text: names.length ? names.join(", ") : SELECTED_CITIES_TEXT[locale] };
}

export function mapVoucherDetailToDeal(
  raw: RawVoucherDetail,
  locale: Locale,
  fallbackId?: string
): VoucherDeal {
  const title =
    pickLocale(raw.title_en, raw.title_ar, locale) ||
    pickLocale(raw.about?.content_en, raw.about?.content_ar, locale) ||
    "Voucher Deal";
  const about = pickAboutContent(raw.about, locale);
  const description = about || localizedTextOrUndefined(raw.terms, locale);

  return {
    id: raw._id || fallbackId || "",
    title,
    description,
    images: toImages(raw.pic, title, "voucher"),
    dealType: "voucher",
    timer: defaultTimer(raw.endDate),
    location: citiesLocation(Boolean(raw.allKsa), raw.cities, locale),
    quantity: defaultQuantity(raw.quantity, raw.sold),
    dealPrice: raw.dealPrice,
    saveAmount: raw.save ?? Math.max(0, (raw.voucherValue ?? 0) - raw.dealPrice),
    currency: "SAR",
    isActive: isStatusActive(raw.status),
    supplier: supplierName(raw.supplier, locale),
    supplierLogo: supplierLogo(raw.supplier),
    supplierId: supplierId(raw.supplier),
    voucherValue: raw.voucherValue,
    detailContent: buildDetailContent({
      about: raw.about,
      deliveryTerms: raw.terms,
      customerPaymentTerms: raw.customerPaymentTerms,
      locale,
    }),
  };
}

function mapDealDetailToDeal(
  raw: RawDealDetail,
  locale: Locale,
  dealType: "original" | "cold"
): OriginalDeal | ColdDeal {
  const title = pickLocale(raw.title_en, raw.title_ar, locale);
  const description = pickLocale(
    raw.product.description_en,
    raw.product.description_ar,
    locale
  ) || undefined;

  const productName = pickLocale(raw.product.name_en, raw.product.name_ar, locale) || undefined;
  const about = pickAboutContent(raw.about, locale);

  const base = {
    id: raw._id,
    title,
    description: about || description,
    productName,
    images: toImages(raw.product.pic, title, "product"),
    timer: defaultTimer(raw.endDate),
    location: citiesLocation(Boolean(raw.allKsa), raw.cities, locale),
    quantity: defaultQuantity(raw.quantity, raw.sold),
    dealPrice: raw.dealPrice,
    saveAmount: raw.save,
    currency: "SAR",
    isActive: isStatusActive(raw.status),
    supplier: supplierName(raw.supplier, locale),
    supplierLogo: supplierLogo(raw.supplier),
    supplierId: supplierId(raw.supplier),
    marketPrice: raw.product.marketPrice ?? raw.dealPrice,
    detailContent: buildDetailContent({
      about: raw.about,
      paymentTerms: raw.paymentTerms,
      deliveryTerms: raw.deliveryTerms,
      customerPaymentTerms: raw.customerPaymentTerms,
      locale,
    }),
  };

  return dealType === "original"
    ? ({ ...base, dealType: "original" } as OriginalDeal)
    : ({ ...base, dealType: "cold" } as ColdDeal);
}

export function mapPublicDealDetailResponse(
  data: RawPublicDealDetailResponse,
  locale: Locale,
  fallbackId?: string,
  hintDealType?: DealType | null
): Deal {
  const dealType = resolvePublicDealType(data, hintDealType);
  if (!dealType) {
    throw new Error(`Unsupported deal type: ${data.type}`);
  }

  if (dealType === "voucher") {
    if (!data.voucher) {
      throw new Error("Voucher deal payload is missing");
    }
    return mapVoucherDetailToDeal(data.voucher, locale, fallbackId);
  }

  if (!data.deal) {
    throw new Error("Deal payload is missing");
  }

  return mapDealDetailToDeal(data.deal, locale, dealType);
}

export const mapOriginalDetailToDeal = (raw: RawDealDetail, locale: Locale): OriginalDeal =>
  mapDealDetailToDeal(raw, locale, "original") as OriginalDeal;

export const mapColdDetailToDeal = (raw: RawDealDetail, locale: Locale): ColdDeal =>
  mapDealDetailToDeal(raw, locale, "cold") as ColdDeal;

export class DealsService {
  static async getHome(params: HomeFeedParams): Promise<HomeFeedResult> {
    const query = buildHomeQuery(params);
    const response = await fetchWithOptionalAuth(`${API_ENDPOINTS.HOME}?${query.toString()}`);
    const data = await handleApiResponse<RawHomeResponse>(response);

    const deals = (data.home || [])
      .map((item) => mapBackendDealToUIDeal(item, params.locale))
      .filter((deal): deal is Deal => deal !== null);

    return {
      deals,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      total: data.total,
    };
  }

  static async getVoucherDetail(id: string, locale: Locale): Promise<VoucherDeal> {
    const response = await fetchWithOptionalAuth(API_ENDPOINTS.VOUCHER_DETAIL(id));
    const data = await handleApiResponse<RawVoucherDetailResponse>(response);
    return mapVoucherDetailToDeal(data.voucher, locale);
  }

  static async getOriginalDetail(id: string, locale: Locale): Promise<OriginalDeal> {
    const response = await fetchWithOptionalAuth(API_ENDPOINTS.ORIGINAL_DETAIL(id));
    const data = await handleApiResponse<RawDealDetailResponse>(response);
    return mapOriginalDetailToDeal(data.deal, locale);
  }

  static async getColdDetail(id: string, locale: Locale): Promise<ColdDeal> {
    const response = await fetchWithOptionalAuth(API_ENDPOINTS.COLD_DETAIL(id));
    const data = await handleApiResponse<RawDealDetailResponse>(response);
    return mapColdDetailToDeal(data.deal, locale);
  }

  static async getDealDetail(dealType: DealType, id: string, locale: Locale): Promise<Deal> {
    if (dealType === "voucher") return DealsService.getVoucherDetail(id, locale);
    if (dealType === "cold") return DealsService.getColdDetail(id, locale);
    return DealsService.getOriginalDetail(id, locale);
  }

  static async getPublicDealDetail(
    id: string,
    locale: Locale,
    dealType?: DealType | null
  ): Promise<Deal> {
    const query = new URLSearchParams();
    if (dealType) {
      query.set("dealKind", dealType);
    }

    const queryString = query.toString();
    const path = `${API_ENDPOINTS.PUBLIC_DEAL_DETAIL(id)}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message =
        error.message || error.error || "An error occurred while fetching data";
      throw new ApiError(message, response.status);
    }

    const data = (await response.json()) as RawPublicDealDetailResponse & {
      error?: string;
      message?: string;
    };

    if (data.error && !data.type) {
      throw new ApiError(data.message || data.error, 404);
    }

    return mapPublicDealDetailResponse(data, locale, id, dealType);
  }
}
