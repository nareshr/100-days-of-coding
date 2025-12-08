// src/registerServiceWorker.js
import { registerSW } from 'virtual:pwa-register'

export function setupServiceWorker(onUpdateFound) {
  const updateSW = registerSW({
    onRegistered(r) {
      // r is service worker registration
      console.log('SW registered', r)
    },
    onNeedRefresh() {
      // Called when a new SW is found
      console.log('New content available')
      if (onUpdateFound) onUpdateFound()
    }
  })

  return updateSW
}
