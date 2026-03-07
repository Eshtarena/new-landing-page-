import type { VoucherApiResponse } from "../types/api/voucher";
import type { VoucherDeal, DealTimer } from "../types/deals";
import { API_BASE_URL, BACKEND_PUBLIC_BASE, getGuestAuthHeaders } from "./config";

/** Voucher deal image: backend_base_url/public/voucher/image */
const VOUCHER_IMAGE_BASE = `${BACKEND_PUBLIC_BASE}/public/voucher`;
/** Supplier image: backend_base_url/public/supplier/image */
const SUPPLIER_IMAGE_BASE = `${BACKEND_PUBLIC_BASE}/public/supplier`;

/**
 * Fetch voucher details from API.
 * GET /v1/user/voucher/:voucherId
 */
export async function fetchVoucherDetails(
  voucherId: string
): Promise<VoucherApiResponse> {
  const url = `${API_BASE_URL}/user/voucher/${voucherId}`;
  const res = await fetch(url, { headers: getGuestAuthHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "Failed to load voucher");
  }
  return res.json();
}

/**
 * Parse API endDate string to countdown timer (days, hours, minutes, seconds from now).
 */
function parseEndDateToTimer(endDateStr: string): DealTimer {
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

export type Lang = "en" | "ar";

/**
 * Map API voucher response to app VoucherDeal (with paymentTerms for Terms tab).
 */
export function mapVoucherApiToDeal(
  data: VoucherApiResponse,
  lang: Lang
): VoucherDeal {
  const v = data.voucher;
  const isEn = lang === "en";

  const timer = parseEndDateToTimer(v.endDate);
  const total = v.quantity;
  const sold = v.sold;
  const available = Math.max(0, total - sold);
  const locationText = v.allKsa ? "All KSA" : (v.districts?.length || v.cities?.length) ? "Selected areas" : "KSA";

  const paymentTerms = (v.customerPaymentTerms || []).map((t) => ({
    title: isEn ? t.title_en : t.title_ar,
    description: isEn ? t.desc_en : t.desc_ar,
  }));

  const statusLower = (v.status || "").trim().toLowerCase();
  const statusLabel = statusLower === "ended" || statusLower === "end" ? "Ended" as const : "On going" as const;
  const isActive = statusLabel === "On going";

  // Voucher has a single deal image (pic); cold/original may have multiple (pics/images)
  return {
    id: v._id,
    title: isEn ? v.title_en : v.title_ar,
    description: v.about ? (isEn ? v.about.content_en : v.about.content_ar) : undefined,
    images: v.pic
      ? [{ src: `${VOUCHER_IMAGE_BASE}/${v.pic}`, alt: isEn ? v.title_en : v.title_ar }]
      : [],
    dealType: "voucher",
    timer,
    location: { text: locationText },
    quantity: { sold, available },
    dealPrice: v.dealPrice,
    saveAmount: v.save,
    currency: "SAR",
    voucherValue: v.voucherValue,
    expireDate: v.expireDate,
    isActive,
    statusLabel,
    supplier: v.supplier ? (isEn ? v.supplier.name_en : v.supplier.name_ar) : undefined,
    supplierPic: v.supplier?.pic ? `${SUPPLIER_IMAGE_BASE}/${v.supplier.pic}` : undefined,
    paymentTerms: paymentTerms.length ? paymentTerms : undefined,
  };
}
