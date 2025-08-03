export const API_BASE_URL = "https://api.eshtarena.com/v1";

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