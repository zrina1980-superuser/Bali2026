const CACHE_NAME = 'bali-2026-v2';
const urlsToCache = [
  './',
  './index.html' // Pazi da se tvoj glavni HTML file zove ovako. Ako se zove drugačije, preimenuj ovo ovdje.
];

// Instalacija (sprema fileove u cache mobitela)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Vuče podatke iz cachea kad nema neta
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ako postoji u cacheu, vrati ga, inače probaj skinuti s weba
        return response || fetch(event.request);
      })
  );
});
