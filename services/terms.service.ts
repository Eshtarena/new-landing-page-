import { API_BASE_URL, API_ENDPOINTS, handleApiResponse, createApiError } from "./config";
import type { TermsResponse } from "../types/terms";

export class TermsService {
  static async getTerms(): Promise<TermsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TERMS}`);
      const data = await handleApiResponse<TermsResponse>(response);

      if (data.message !== "success" || !data.terms?.length) {
        throw createApiError("Failed to fetch terms");
      }

      return data;
    } catch (error) {
      console.error("Error in getTerms:", error);
      throw error;
    }
  }
} 