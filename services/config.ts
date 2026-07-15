export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.eshtarena.com";

export const API_ENDPOINTS = {
  TERMS: "/v1/terms-and-conditions",
  PRIVACY_POLICY: "/v1/privacy-policy",
  CONTACT_US: "/v1/contact-us",
  SOCIAL_LINKS: "/v1/about/links",
  ADVICE: "/v1/advice",
  ADS: "/v1/user/ads",
  CATEGORIES: "/v1/user/categories",
  HOME: "/v1/user/home",
  VOUCHER_DETAIL: (id: string) => `/v1/user/voucher/${id}`,
  ORIGINAL_DETAIL: (id: string) => `/v1/user/orginal-details/${id}`,
  COLD_DETAIL: (id: string) => `/v1/user/cold-details/${id}`,
  PUBLIC_DEAL_DETAIL: (id: string) => `/v1/public/deals/${id}`,
} as const;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Resolve a `pic`/`categoryImg`/`logo` filename returned by the backend into a full static asset URL. */
export const resolvePublicAsset = (folder: string, filename?: string): string => {
  if (!filename) return "";
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${API_BASE_URL}/public/${folder}/${filename}`;
};

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error.message || error.error || "An error occurred while fetching data";
    throw new ApiError(message, response.status);
  }

  const data = await response.json();
  return data;
};

export const createApiError = (message: string): Error => {
  return new Error(message);
};

/**
 * Fetch helper that attaches a Bearer token when one is available (browser only —
 * this app has no login flow, so `getAuthToken` returning undefined is the common case
 * and every caller must work correctly as a guest).
 */
export const getAuthToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage.getItem("authToken") || undefined;
  } catch {
    return undefined;
  }
};

export const fetchWithOptionalAuth = async (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}; 