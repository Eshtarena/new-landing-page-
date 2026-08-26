import { useCallback, useState } from "react";
import { getDeviceOS } from "../utils/device";
import {
  APP_STORE_URLS,
  openAppStoreUrl,
  resolveJoinDealAction,
} from "../utils/appStore";

export function useJoinDeal() {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleJoinDeal = useCallback(() => {
    const result = resolveJoinDealAction(APP_STORE_URLS);

    if (result.action === "desktop-fallback") {
      setShowDesktopModal(true);
      return;
    }

    if (getDeviceOS() === "ios") {
      setShowComingSoon(true);
      return;
    }

    openAppStoreUrl(result.url);
  }, []);

  const closeDesktopModal = useCallback(() => {
    setShowDesktopModal(false);
  }, []);

  const closeComingSoon = useCallback(() => {
    setShowComingSoon(false);
  }, []);

  return {
    handleJoinDeal,
    showDesktopModal,
    closeDesktopModal,
    showComingSoon,
    closeComingSoon,
  };
}
