// UI-facing banner type. Components only ever see this shape — never the raw /v1/user/ads payload.
export interface Banner {
  id: string;
  imageUrl_en: string;
  imageUrl_ar: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
  /** Not part of the UI spec's mapping table, but useful as image alt text. */
  title_en?: string;
  title_ar?: string;
}
