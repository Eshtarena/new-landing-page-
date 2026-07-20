import { useEffect, useState } from "react";
import { ApiError } from "../services/config";
import { SuppliersService } from "../services/suppliers.service";
import type { SupplierDetail } from "../types/supplier";

export function useSupplierDetail(id: string | null, locale: "en" | "ar" = "en", limit = 20) {
  const [detail, setDetail] = useState<SupplierDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      if (!id) {
        setDetail(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      SuppliersService.getPublicSupplierDetail(id, locale, limit)
        .then((data) => {
          if (!cancelled) setDetail(data);
        })
        .catch((err) => {
          if (!cancelled) {
            setDetail(null);
            setError(
              err instanceof ApiError
                ? err
                : new ApiError(
                    err instanceof Error ? err.message : "Failed to load supplier",
                    500
                  )
            );
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [id, locale, limit]);

  return {
    detail,
    supplier: detail?.supplier ?? null,
    originalDeals: detail?.originalDeals ?? [],
    coldDeals: detail?.coldDeals ?? [],
    voucherDeals: detail?.voucherDeals ?? [],
    isLoading,
    error,
  };
}
