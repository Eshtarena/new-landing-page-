import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    __preserveScrollOnNextRoute?: boolean;
  }
}

const scrollPositions = new Map<string, number>();

function getPathKey(url: string): string {
  return url.split("#")[0];
}

function instantScrollTo(y: number): void {
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
  window.scrollTo(0, y);
}

export default function ScrollRestoration() {
  const router = useRouter();
  const isPopNavigation = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    router.beforePopState(() => {
      isPopNavigation.current = true;
      return true;
    });

    const onStart = (_url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) {
        return;
      }

      scrollPositions.set(getPathKey(router.asPath), window.scrollY);

      // Locale switches fade the page instead of flashing a white overlay.
      if (window.__preserveScrollOnNextRoute) {
        return;
      }

      setIsNavigating(true);
    };

    const onComplete = (url: string) => {
      const preserveScroll = window.__preserveScrollOnNextRoute === true;
      window.__preserveScrollOnNextRoute = false;

      if (!preserveScroll) {
        if (isPopNavigation.current) {
          const savedY = scrollPositions.get(getPathKey(url));
          instantScrollTo(savedY ?? 0);
          isPopNavigation.current = false;
        } else {
          instantScrollTo(0);
        }
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsNavigating(false);
        });
      });
    };

    const onError = () => {
      window.__preserveScrollOnNextRoute = false;
      isPopNavigation.current = false;
      setIsNavigating(false);
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);
    router.events.on("routeChangeError", onError);

    return () => {
      window.history.scrollRestoration = previousRestoration;
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
      router.events.off("routeChangeError", onError);
    };
  }, [router]);

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-white"
      aria-hidden="true"
      data-navigation-overlay
    />
  );
}
