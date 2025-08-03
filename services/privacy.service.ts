import { API_BASE_URL, API_ENDPOINTS, handleApiResponse, createApiError } from "./config";
import type { PrivacyPolicyResponse } from "../types/terms";

export class PrivacyService {
  static async getPrivacyPolicy(type: string = "consumer"): Promise<PrivacyPolicyResponse> {
    try {
      const queryParams = new URLSearchParams({ type }).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRIVACY_POLICY}?${queryParams}`;
      const response = await fetch(url);
      const data = await handleApiResponse<PrivacyPolicyResponse>(response);

      if (data.message !== "success" || !data.policies?.length) {
        throw createApiError("Failed to fetch privacy policy");
      }

      return data;
    } catch (error) {
      console.error("Error in getPrivacyPolicy:", error);
      throw error;
    }
  }
} 