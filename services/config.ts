export const API_BASE_URL = "https://api.eshtarena.com/v1";

/** Base URL for public assets (images). Use with /public/{type}/{filename}. */
export const BACKEND_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://api.eshtarena.com";

/** Fixed Bearer token for guest users (deal details, etc.). Override with NEXT_PUBLIC_GUEST_AUTH_TOKEN if needed. */
export const GUEST_AUTH_TOKEN =
  process.env.NEXT_PUBLIC_GUEST_AUTH_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR3Vlc3QiLCJhY3RpdmF0ZWQiOnRydWUsInRvVXNlIjoiRXNodGFyZW5hIiwiaWF0IjoxNjk3NzEwNTQwfQ.nh-INBp5yYmIn2timl8lB2CJq_zCwMQesQwyZZsutz8";

/** Default headers for authenticated guest API calls (Bearer token). */
export const getGuestAuthHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${GUEST_AUTH_TOKEN}`,
});

export const API_ENDPOINTS = {
  TERMS: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  // Add other endpoints here as needed
} as const;

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred while fetching data");
  }

  const data = await response.json();
  return data;
};

export const createApiError = (message: string): Error => {
  return new Error(message);
}; 