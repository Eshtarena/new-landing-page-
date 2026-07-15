import { useCallback, useState } from "react";
import { getDeviceOS } from "../utils/device";
import {
  APP_STORE_URLS,
  openAppStoreUrl,
  openIOSAppOrStore,
  resolveJoinDealAction,
} from "../utils/appStore";

export function useJoinDeal() {
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  const handleJoinDeal = useCallback(() => {
    const result = resolveJoinDealAction(APP_STORE_URLS);

    if (result.action === "desktop-fallback") {
      setShowDesktopModal(true);
      return;
    }

    if (getDeviceOS() === "ios") {
      openIOSAppOrStore(APP_STORE_URLS);
      return;
    }

    openAppStoreUrl(result.url);
  }, []);

  const closeDesktopModal = useCallback(() => {
    setShowDesktopModal(false);
  }, []);

  return {
    handleJoinDeal,
    showDesktopModal,
    closeDesktopModal,
  };
}
