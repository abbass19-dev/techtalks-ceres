"use client";

import { useEffect, useState } from "react";

export type FoodSuggestion = {
  name: string;
  aliases?: string[];
  category?: string;
};

export function useFoodSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<FoodSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/food/search?query=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setResults(Array.isArray(data.suggestions) ? data.suggestions : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, loading };
}
