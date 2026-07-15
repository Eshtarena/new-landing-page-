import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. Defaults to `false` on the server so
 * hydration matches; syncs on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True below Tailwind's `lg` breakpoint (1024px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 1023px)");
}
