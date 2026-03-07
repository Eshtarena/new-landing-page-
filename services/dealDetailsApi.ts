import type { ColdDetailsApiResponse, OriginalDetailsApiResponse, DealDetailsApiDeal } from "../types/api/dealDetails";
import type { ColdDeal, OriginalDeal, DealTimer } from "../types/deals";
import { API_BASE_URL, BACKEND_PUBLIC_BASE, getGuestAuthHeaders } from "./config";
import type { Lang } from "./voucherApi";

/** Cold/original deal image: backend_base_url/public/deal/image */
const DEAL_IMAGE_BASE = `${BACKEND_PUBLIC_BASE}/public/deal`;
/** Supplier image: backend_base_url/public/supplier/image */
const SUPPLIER_IMAGE_BASE = `${BACKEND_PUBLIC_BASE}/public/supplier`;

/**
 * Normalize API status to "On going" | "Ended" for display.
 */
export function normalizeStatus(status: string | undefined): "On going" | "Ended" {
  if (!status || typeof status !== "string") return "On going";
  const lower = status.trim().toLowerCase();
  if (lower === "ended" || lower === "end") return "Ended";
  return "On going";
}

function parseEndDateToTimer(endDateStr: string | undefined): DealTimer {
  if (!endDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const end = new Date(endDateStr).getTime();
  const now = Date.now();
  let diff = Math.max(0, Math.floor((end - now) / 1000));
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
}

function extractDealFromColdResponse(data: ColdDetailsApiResponse): DealDetailsApiDeal | null {
  const d = data as Record<string, unknown>;
  if (d.cold && typeof d.cold === "object") return d.cold as DealDetailsApiDeal;
  if (d.coldDeal && typeof d.coldDeal === "object") return d.coldDeal as DealDetailsApiDeal;
  if (d._id && d.title_en) return d as unknown as DealDetailsApiDeal;
  return null;
}

function extractDealFromOriginalResponse(data: OriginalDetailsApiResponse): DealDetailsApiDeal | null {
  const d = data as Record<string, unknown>;
  if (d.original && typeof d.original === "object") return d.original as DealDetailsApiDeal;
  if (d.originalDeal && typeof d.originalDeal === "object") return d.originalDeal as DealDetailsApiDeal;
  if (d._id && d.title_en) return d as unknown as DealDetailsApiDeal;
  return null;
}

/** Build deal images array: support single pic or multiple pics/images from API */
function mapDealImages(
  v: DealDetailsApiDeal,
  lang: Lang,
  baseUrl: string
): { src: string; alt: string }[] {
  const alt = (lang === "en" ? v.title_en : v.title_ar) || v.title_en || v.title_ar || "Deal";
  const multi = (v.pics ?? v.images) as string[] | undefined;
  if (multi?.length) {
    return multi.map((filename) => ({
      src: `${baseUrl}/${filename}`,
      alt,
    }));
  }
  if (v.pic) {
    return [{ src: `${baseUrl}/${v.pic}`, alt }];
  }
  return [];
}

function mapCommonDealFields(
  v: DealDetailsApiDeal,
  lang: Lang,
  dealType: "cold" | "original"
): Pick<ColdDeal, "id" | "title" | "description" | "images" | "timer" | "location" | "quantity" | "dealPrice" | "saveAmount" | "currency" | "isActive" | "supplier" | "supplierPic" | "statusLabel"> {
  const isEn = lang === "en";
  const statusLabel = normalizeStatus(v.status);
  const isActive = statusLabel === "On going";
  const total = v.quantity ?? 0;
  const sold = v.sold ?? 0;
  const available = Math.max(0, total - sold);
  const locationText = v.allKsa ? "All KSA" : (v.districts?.length || v.cities?.length) ? "Selected areas" : "KSA";

  return {
    id: v._id,
    title: (isEn ? v.title_en : v.title_ar) || (v.title_en || v.title_ar) || "",
    description: v.about ? (isEn ? v.about.content_en : v.about.content_ar) : undefined,
    images: mapDealImages(v, lang, DEAL_IMAGE_BASE),
    timer: parseEndDateToTimer(v.endDate),
    location: { text: locationText },
    quantity: { sold, available },
    dealPrice: v.dealPrice ?? 0,
    saveAmount: v.save ?? 0,
    currency: "SAR",
    isActive,
    statusLabel,
    supplier: v.supplier ? (isEn ? v.supplier.name_en : v.supplier.name_ar) : undefined,
    supplierPic: v.supplier?.pic ? `${SUPPLIER_IMAGE_BASE}/${v.supplier.pic}` : undefined,
  };
}

/**
 * Fetch cold deal details.
 * GET /v1/user/cold-details/:_id
 */
export async function fetchColdDetails(dealId: string): Promise<ColdDetailsApiResponse> {
  const url = `${API_BASE_URL}/user/cold-details/${dealId}`;
  const res = await fetch(url, { headers: getGuestAuthHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Failed to load cold deal");
  }
  return res.json();
}

/**
 * Fetch original deal details.
 * GET /v1/user/orginal-details/:_id
 */
export async function fetchOriginalDetails(dealId: string): Promise<OriginalDetailsApiResponse> {
  const url = `${API_BASE_URL}/user/orginal-details/${dealId}`;
  const res = await fetch(url, { headers: getGuestAuthHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Failed to load original deal");
  }
  return res.json();
}

export function mapColdApiToDeal(data: ColdDetailsApiResponse, lang: Lang): ColdDeal | null {
  const v = extractDealFromColdResponse(data);
  if (!v) return null;
  const common = mapCommonDealFields(v, lang, "cold");
  const marketPrice = v.marketPrice ?? common.dealPrice + common.saveAmount;
  return {
    ...common,
    dealType: "cold",
    marketPrice,
  };
}

export function mapOriginalApiToDeal(data: OriginalDetailsApiResponse, lang: Lang): OriginalDeal | null {
  const v = extractDealFromOriginalResponse(data);
  if (!v) return null;
  const common = mapCommonDealFields(v, lang, "original");
  const marketPrice = v.marketPrice ?? common.dealPrice + common.saveAmount;
  return {
    ...common,
    dealType: "original",
    marketPrice,
  };
}
