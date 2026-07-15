import { useEffect, useState } from "react";
import { ApiError } from "../services/config";
import { DealsService } from "../services/deals.service";
import type { Deal, DealType } from "../types/deals";

export function useDealDetail(dealType: DealType | null, id: string | null, locale: "en" | "ar") {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      if (!id) {
        setDeal(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      DealsService.getPublicDealDetail(id, locale, dealType)
        .then((data) => {
          if (!cancelled) setDeal(data);
        })
        .catch((err) => {
          if (!cancelled) {
            setDeal(null);
            setError(
              err instanceof ApiError
                ? err
                : new ApiError(
                    err instanceof Error ? err.message : "Failed to load deal",
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
  }, [dealType, id, locale]);

  return { deal, isLoading, error };
}
