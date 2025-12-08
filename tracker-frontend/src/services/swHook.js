// src/services/swHook.js
// This hook listens for service worker update events using the Vite PWA API

import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export function useServiceWorkerUpdate() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // This register function comes from Vite's PWA plugin.
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      setUpdateAvailable(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    }
  });

  // Expose a reload function to Dashboard.jsx
  const reloadPage = () => {
    updateSW(true);
  };

  return {
    offlineReady,
    updateAvailable,
    reloadPage
  };
}
