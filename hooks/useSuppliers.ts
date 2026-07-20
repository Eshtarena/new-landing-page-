import { useEffect, useState } from "react";
import { SuppliersService } from "../services/suppliers.service";
import type { Supplier } from "../types/supplier";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      setIsLoading(true);
      setError(null);

      SuppliersService.getSuppliers()
        .then((data) => {
          if (!cancelled) setSuppliers(data);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load suppliers"));
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

  return { suppliers, isLoading, error };
}
