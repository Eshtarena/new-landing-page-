import { VALID_COUNTRIES, type ValidCountry } from "./routes";

const STORAGE_KEY = "eshtarena_selected_country";

/**
 * Get the latest selected country code from storage (client-only).
 * Use when the page doesn't receive countryCode in the URL (e.g. deal share links).
 */
export function getLatestCountryCode(): ValidCountry | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_COUNTRIES.includes(stored as ValidCountry)) {
      return stored as ValidCountry;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Persist the selected country so it can be used as fallback on pages without country in URL.
 * Call this when the user selects a country (e.g. country switcher, or after visiting /[countryCode]/...).
 */
export function setLatestCountryCode(countryCode: ValidCountry): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, countryCode);
  } catch {
    // ignore
  }
}
