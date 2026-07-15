export type DeviceOS = "ios" | "android" | "other";

/**
 * Detect the user's operating system from the user agent.
 * Handles iPadOS 13+ devices that report a desktop Macintosh UA.
 */
export function getDeviceOS(userAgent?: string): DeviceOS {
  if (typeof window === "undefined" && !userAgent) {
    return "other";
  }

  const ua =
    userAgent ??
    (typeof navigator !== "undefined" ? navigator.userAgent : "");

  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (typeof navigator !== "undefined" &&
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1);

  if (isIOS) {
    return "ios";
  }

  if (/android/i.test(ua)) {
    return "android";
  }

  return "other";
}
