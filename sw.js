// OVO JE NAJVAŽNIJE: Kad god mijenjaš index.html, ovdje samo promijeni V1 u V2, V3 itd.
const CACHE_NAME = 'bali-2026-v4'; 
const ASSETS = [
  './',
  './index.html'
];

// Instalacija novog Workera
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  // Odmah gura novu verziju naprijed
  self.skipWaiting();
});

// Čišćenje starog smeća
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Vadi iz cachea samo ako nema interneta
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
