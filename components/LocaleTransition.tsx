import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { LOCALE_SWITCH_START } from "../utils/localeSwitch";

interface LocaleTransitionProps {
  children: ReactNode;
}

export default function LocaleTransition({ children }: LocaleTransitionProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const isLocaleSwitch = useRef(false);

  useEffect(() => {
    const fadeOut = () => {
      isLocaleSwitch.current = true;
      setVisible(false);
    };

    const fadeIn = () => {
      if (!isLocaleSwitch.current) {
        return;
      }

      isLocaleSwitch.current = false;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    };

    const onRouteStart = (_url: string, { shallow }: { shallow: boolean }) => {
      if (shallow || !window.__preserveScrollOnNextRoute) {
        return;
      }

      fadeOut();
    };

    const onRouteComplete = () => {
      fadeIn();
    };

    const onRouteError = () => {
      isLocaleSwitch.current = false;
      window.__preserveScrollOnNextRoute = false;
      setVisible(true);
    };

    window.addEventListener(LOCALE_SWITCH_START, fadeOut);
    router.events.on("routeChangeStart", onRouteStart);
    router.events.on("routeChangeComplete", onRouteComplete);
    router.events.on("routeChangeError", onRouteError);

    return () => {
      window.removeEventListener(LOCALE_SWITCH_START, fadeOut);
      router.events.off("routeChangeStart", onRouteStart);
      router.events.off("routeChangeComplete", onRouteComplete);
      router.events.off("routeChangeError", onRouteError);
    };
  }, [router]);

  return (
    <div
      className="transition-opacity duration-200 ease-out motion-reduce:transition-none"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
