import type { DealCityCoverage } from "../types/deals";

type Locale = "en" | "ar";

interface RawDistrict {
  district_en?: string;
  district_ar?: string;
}

interface RawCityRef {
  city_en?: string;
  city_ar?: string;
}

interface RawCityEntry {
  city?: RawCityRef;
  city_en?: string;
  city_ar?: string;
  districts?: RawDistrict[];
}

function pickLocale(en: string | undefined, ar: string | undefined, locale: Locale): string {
  return (locale === "en" ? en : ar) || en || ar || "";
}

function mapDistricts(districts: unknown[] | undefined, locale: Locale): string[] {
  return (districts || [])
    .map((entry) => {
      if (!entry || typeof entry !== "object") return "";
      const district = entry as RawDistrict;
      return pickLocale(district.district_en, district.district_ar, locale);
    })
    .filter(Boolean);
}

export function mapDealCityCoverage(
  cities: unknown[] | undefined,
  districts: unknown[] | undefined,
  locale: Locale
): DealCityCoverage[] {
  const mapped = (cities || [])
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const cityEntry = entry as RawCityEntry;
      const city = cityEntry.city
        ? pickLocale(cityEntry.city.city_en, cityEntry.city.city_ar, locale)
        : pickLocale(cityEntry.city_en, cityEntry.city_ar, locale);
      if (!city) return null;
      return {
        city,
        districts: mapDistricts(cityEntry.districts, locale),
      };
    })
    .filter((entry): entry is DealCityCoverage => entry !== null);

  if (mapped.length > 0) return mapped;

  const flatDistricts = mapDistricts(districts, locale);
  if (flatDistricts.length > 0) {
    return [{ city: flatDistricts.join(", "), districts: [] }];
  }

  return [];
}

export function dealCoverageLocationText(
  allKsa: boolean,
  cities: DealCityCoverage[],
  locale: Locale
): string {
  if (allKsa) return locale === "ar" ? "جميع أنحاء المملكة" : "All KSA";
  if (cities.length > 0) {
    return cities.map((entry) => entry.city).join(", ");
  }
  return locale === "ar" ? "مدن مختارة" : "Selected areas";
}
