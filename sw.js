const CACHE_NAME = 'roaring-lion-brewing-time-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) return response;
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then(response => response || caches.match('./index.html') || new Response('Offline', { status: 503 })))
  );
});
