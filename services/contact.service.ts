import { API_BASE_URL, API_ENDPOINTS, handleApiResponse, createApiError } from "./config";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormResponse {
  message: string;
}

export class ContactService {
  static async submit(formData: ContactFormData): Promise<ContactFormResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACT_US}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      return await handleApiResponse<ContactFormResponse>(response);
    } catch (error) {
      throw createApiError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    }
  }
}
