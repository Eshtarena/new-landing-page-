// UI-facing banner type. Components only ever see this shape — never the raw /v1/public/ads payload.
export interface Banner {
  id: string;
  imageUrl_en: string;
  imageUrl_ar: string;
  /** Mobile-breakpoint variant of the banner image. Null when the backend has no `mobPic` for this ad — callers must fall back to imageUrl_en/ar. */
  mobileImageUrl: string | null;
  linkUrl: string;
  order: number;
  isActive: boolean;
  /** Not part of the UI spec's mapping table, but useful as image alt text. */
  title_en?: string;
  title_ar?: string;
}
