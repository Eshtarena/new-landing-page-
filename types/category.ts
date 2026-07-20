// UI-facing category type. Components only ever see this shape — never the raw /v1/user/categories payload.
export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  iconUrl: string;
  link: string;
  order: number;
}
