/**
 * API response types for voucher details endpoint:
 * GET https://api.eshtarena.com/v1/user/voucher/:voucherId
 */

export interface VoucherApiPaymentTerm {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface VoucherApiSupplier {
  _id: string;
  name_en: string;
  name_ar: string;
  pic: string;
}

export interface VoucherApiAbout {
  _id: string;
  content_en: string;
  content_ar: string;
}

export interface VoucherApiResponse {
  voucher: {
    _id: string;
    title_en: string;
    title_ar: string;
    quantity: number;
    sold: number;
    customerPaymentTerms: VoucherApiPaymentTerm[];
    pic: string;
    allKsa: boolean;
    supplier: VoucherApiSupplier;
    endDate: string;
    districts: unknown[];
    type: string;
    status: string;
    voucherValue: number;
    dealPrice: number;
    save: number;
    expireDate: string;
    terms: unknown[] | string;
    cities: unknown[];
    about: VoucherApiAbout;
    isTracked: boolean;
    isJoined: boolean;
  };
}
