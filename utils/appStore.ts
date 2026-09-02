import { getDeviceOS } from "./device";

export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=sharena.app";

export const APP_STORE_URLS = {
  apple: "https://apps.apple.com/app/eshtarena",
  google: GOOGLE_PLAY_URL,
} as const;

/** Custom URL scheme used to deep-link into the native app before falling back to the store. */
export const IOS_DEEP_LINK_SCHEME = "haai://";

export type AppStoreUrls = {
  apple: string;
  google: string;
};

export type JoinDealResult =
  | { action: "redirect"; url: string }
  | { action: "desktop-fallback" };

/**
 * Resolve where a Join Deal click should go based on the user's OS.
 * Call this inside a click handler so it only runs client-side.
 */
export function resolveJoinDealAction(
  urls: AppStoreUrls = APP_STORE_URLS
): JoinDealResult {
  const os = getDeviceOS();

  if (os === "ios") {
    return { action: "redirect", url: urls.apple };
  }

  if (os === "android") {
    return { action: "redirect", url: urls.google };
  }

  return { action: "desktop-fallback" };
}

/**
 * Attempt to open the native iOS app via custom scheme, then fall back to the App Store.
 */
export function openIOSAppOrStore(
  urls: AppStoreUrls = APP_STORE_URLS,
  deepLinkScheme: string = IOS_DEEP_LINK_SCHEME
): void {
  if (typeof window === "undefined") {
    return;
  }

  const openedAt = Date.now();
  window.location.assign(deepLinkScheme);

  window.setTimeout(() => {
    if (Date.now() - openedAt < 3000) {
      window.location.assign(urls.apple);
    }
  }, 1500);
}

export function openAppStoreUrl(url: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(url);
}
