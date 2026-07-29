import { useEffect, useState } from "react";
import { AdviceService } from "../services/advice.service";
import type { AdviceArticle } from "../types/advice";

export function useAdviceArticles(limit = 10) {
  const [articles, setArticles] = useState<AdviceArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    AdviceService.getArticles({ limit })
      .then(({ articles: data }) => {
        if (!cancelled) setArticles(data);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { articles, isLoading };
}
