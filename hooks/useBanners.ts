import { useEffect, useState } from "react";
import { BannersService } from "../services/banners.service";
import type { Banner } from "../types/banner";

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      BannersService.getBanners()
        .then((data) => {
          if (!cancelled) setBanners(data);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load banners"));
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    };
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { banners, isLoading, error };
}
