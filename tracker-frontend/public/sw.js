self.addEventListener("install", event => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", event => {
    clients.claim();
  });
  
  self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
  
    // only cache GET API requests
    if (url.pathname.startsWith("/api/v1") && event.request.method === "GET") {
      event.respondWith(
        caches.open("faang-cache").then(async cache => {
          const cached = await cache.match(event.request);
          
          const fetchPromise = fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => cached);
  
          return cached || fetchPromise;
        })
      );
    }
  });


  self.addEventListener('push', function(event) {
    let data = { title: 'Notification', body: 'You have a message' };
    if (event.data) {
      try { data = event.data.json(); } catch(e) { data = { title: 'Notification', body: event.data.text() } }
    }
    const title = data.title || 'FAANG Tracker';
    const options = { body: data.body, icon: '/pwa-192x192.png', badge: '/pwa-192x192.png', data: data };
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/dashboard'));
  });
  
  