export interface Term {
  _id: string;
  title_en: string;
  content_en: string;
  title_ar: string;
  content_ar: string;
  __v?: number;
}

export interface TermsResponse {
  message: string;
  terms: Term[];
}

export interface PrivacyPolicyResponse {
  message: string;
  policies: Term[];
} 