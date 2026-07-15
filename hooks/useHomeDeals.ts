import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DealsService } from "../services/deals.service";
import type { Deal, DealType } from "../types/deals";
import type { Category } from "../types/category";
import type { FilterState } from "../components/ecommerce/FilterComponent";

interface UseHomeDealsOptions {
  filters: FilterState;
  /** Loaded category list, used to resolve a selected category name back to the id the API expects. */
  categories: Category[];
  /** Direct category id from the URL — takes precedence over filter-based category resolution. */
  categoryId?: string;
  page?: number;
  size?: number;
  search?: string;
}

const DEBOUNCE_MS = 400;

export function useHomeDeals({
  filters,
  categories,
  categoryId: categoryIdFromUrl,
  page = 1,
  size = 24,
  search,
}: UseHomeDealsOptions) {
  const { i18n } = useTranslation("common");
  const locale = i18n.language === "ar" ? "ar" : "en";

  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [debouncedSearch, setDebouncedSearch] = useState(search ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedFilters(filters), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search?.trim() ?? ""), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      const dealTypes: DealType[] | undefined =
        debouncedFilters.dealType === "all" ? undefined : [debouncedFilters.dealType];

      // Backend accepts one category id per request — use the first selection.
      const selectedCategoryName = debouncedFilters.categories[0];
      const categoryIdFromFilter = selectedCategoryName
        ? categories.find(
            (c) => c.name_en === selectedCategoryName || c.name_ar === selectedCategoryName
          )?.id
        : undefined;
      const categoryId = categoryIdFromUrl || categoryIdFromFilter;

      DealsService.getHome({
        page,
        size,
        dealTypes,
        minPrice: debouncedFilters.priceRange.min,
        maxPrice: debouncedFilters.priceRange.max,
        categoryId,
        locations: debouncedFilters.locations.length ? debouncedFilters.locations : undefined,
        search: debouncedSearch || undefined,
        excludeAdvice: true,
        locale,
      })
        .then((result) => {
          if (cancelled) return;
          setDeals(result.deals);
          setTotalPages(result.totalPages);
          setTotal(result.total);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err instanceof Error ? err : new Error("Failed to load deals"));
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [debouncedFilters, debouncedSearch, page, size, locale, categories, categoryIdFromUrl]);

  return { deals, isLoading, error, totalPages, total };
}
