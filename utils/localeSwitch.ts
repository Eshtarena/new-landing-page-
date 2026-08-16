export const LOCALE_SWITCH_START = "locale-switch-start";

declare global {
  interface Window {
    __preserveScrollOnNextRoute?: boolean;
  }
}

export function beginLocaleSwitch(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.__preserveScrollOnNextRoute = true;
  window.dispatchEvent(new CustomEvent(LOCALE_SWITCH_START));
}
