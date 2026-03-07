const CACHE_NAME = 'roaring-lion-brewing-time-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(names.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) return response;
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request).then(response => response || new Response('Offline', { status: 503 })))
  );
});
