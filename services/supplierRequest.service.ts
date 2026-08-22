import { API_BASE_URL, API_ENDPOINTS, createApiError } from "./config";

export interface SupplierRequestContactPerson {
  name: string;
  title: string;
  email: string;
  phone: string;
  message: string;
}

export interface SupplierRequestFormData {
  companyName: string;
  category: string;
  businessEmail: string;
  phoneNumber: string;
  headquarters: string;
  contactPerson: SupplierRequestContactPerson;
}

interface SupplierRequestPayload {
  companyName: string;
  category: string;
  businessEmail: string;
  phoneNumber: string;
  headQuarterAddress: string;
  contactPerson: {
    name: string;
    title: string;
    email: string;
    phoneNumber: string;
  };
  message: string;
}

interface SupplierRequestResponse {
  message: string;
}

export class SupplierRequestService {
  static async submit(formData: SupplierRequestFormData): Promise<SupplierRequestResponse> {
    try {
      const requestBody: SupplierRequestPayload = {
        companyName: formData.companyName,
        category: formData.category,
        businessEmail: formData.businessEmail,
        phoneNumber: formData.phoneNumber,
        headQuarterAddress: formData.headquarters,
        contactPerson: {
          name: formData.contactPerson.name,
          title: formData.contactPerson.title,
          email: formData.contactPerson.email,
          phoneNumber: formData.contactPerson.phone,
        },
        message: formData.contactPerson.message,
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SUPPLIER_REQUEST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit supplier request");
      }

      if (responseData.message === "success") {
        return { message: responseData.message };
      }

      throw new Error("Unexpected response from server");
    } catch (error) {
      throw createApiError(
        error instanceof Error ? error.message : "Failed to submit supplier request"
      );
    }
  }
}
