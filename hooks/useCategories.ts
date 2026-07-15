import { useEffect, useState } from "react";
import { CategoriesService } from "../services/categories.service";
import type { Category } from "../types/category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      CategoriesService.getCategories()
        .then((data) => {
          if (!cancelled) setCategories(data);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load categories"));
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

  return { categories, isLoading, error };
}
