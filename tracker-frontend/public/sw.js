// =============================
// Updated sw.js
// - No caching for /api/v1 (API)
// - Cache only static assets to avoid stale data
// =============================

const CACHE_VERSION = "faang-static-v2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/pwa-192x192.png",
  "/pwa-512x512.png"
  // add other static assets if you want
];

// INSTALL: cache static assets only
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE: clean old caches + take control
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  clients.claim();
});

// FETCH: no caching for /api/v1, safe caching for static
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 1) ALWAYS fetch live API data
  if (url.pathname.startsWith("/api/v1")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2) Cache-first for known static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
    return;
  }

  // 3) Default: network first, fallback to cache on failure
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// PUSH NOTIFICATIONS
self.addEventListener("push", event => {
  let data = { title: "Notification", body: "You have a message" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Notification", body: event.data.text() };
    }
  }
  const title = data.title || "FAANG Tracker";
  const options = {
    body: data.body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// NOTIFICATION CLICK
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/dashboard"));
});


// self.addEventListener("install", event => {
//     self.skipWaiting();
//   });
  
//   self.addEventListener("activate", event => {
//     clients.claim();
//   });
  
//   self.addEventListener("fetch", event => {
//     const url = new URL(event.request.url);
  
//     // only cache GET API requests
//     if (url.pathname.startsWith("/api/v1") && event.request.method === "GET") {
//       event.respondWith(
//         caches.open("faang-cache").then(async cache => {
//           const cached = await cache.match(event.request);
          
//           const fetchPromise = fetch(event.request)
//             .then(response => {
//               cache.put(event.request, response.clone());
//               return response;
//             })
//             .catch(() => cached);
  
//           return cached || fetchPromise;
//         })
//       );
//     }
//   });


//   self.addEventListener('push', function(event) {
//     let data = { title: 'Notification', body: 'You have a message' };
//     if (event.data) {
//       try { data = event.data.json(); } catch(e) { data = { title: 'Notification', body: event.data.text() } }
//     }
//     const title = data.title || 'FAANG Tracker';
//     const options = { body: data.body, icon: '/pwa-192x192.png', badge: '/pwa-192x192.png', data: data };
//     event.waitUntil(self.registration.showNotification(title, options));
//   });
  
//   self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
//     event.waitUntil(clients.openWindow('/dashboard'));
//   });
  
  