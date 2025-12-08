// src/utils/notifications.js
export async function registerServiceWorkerAndSubscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }
    const reg = await navigator.serviceWorker.register('/sw.js');
    // get existing subscription or subscribe using server VAPID public key
    const sub = await reg.pushManager.getSubscription();
    if (sub) return sub;
    // fetch VAPID public key from server
    const res = await fetch('/api/notifications/vapidPublicKey');
    const vapidPublicKey = await res.text();
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
    const newSub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });
    // send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    });
    return newSub;
  }
  

  // src/utils/notifications.js
import api from "../services/api";

export async function registerSWAndSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  // register service worker
  const reg = await navigator.serviceWorker.register('/sw.js');
  // get server VAPID key
  const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/v1/notifications/vapidPublicKey`);
  const vapidPublicKey = await res.text();
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertedKey });
  }

  // send subscription to backend (must be JSON)
  await api.post('/notifications/subscribe', sub);
  return sub;
}

// helper util
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
      output[i] = raw.charCodeAt(i);
  }
  return output;
}
