const CACHE_NAME = 'bali-2026-v5';
const ASSETS = [
  './',
  './index.html',
  './sw.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

async function cacheAsset(cache, asset) {
  const request = asset.startsWith('http') ? new Request(asset, { mode: 'no-cors' }) : asset;
  try {
    await cache.add(request);
  } catch (error) {
    return null;
  }
  return true;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => Promise.all(ASSETS.map(asset => cacheAsset(cache, asset))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }

      throw error;
    }
  })());
});
