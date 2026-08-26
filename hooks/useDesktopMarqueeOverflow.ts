import { RefObject, useLayoutEffect, useState } from "react";

/**
 * Returns true when a single row of items overflows its container on desktop.
 * Used to switch between a centered static row and the animated marquee.
 */
export function useDesktopMarqueeOverflow(
  containerRef: RefObject<HTMLElement | null>,
  measureRef: RefObject<HTMLElement | null>,
  itemCount: number
): boolean {
  const [shouldMarquee, setShouldMarquee] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const update = () => {
      setShouldMarquee(measure.scrollWidth > container.clientWidth);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(measure);

    return () => observer.disconnect();
  }, [itemCount]);

  return shouldMarquee;
}
