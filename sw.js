// --- VERSION CONTROL ---
// UPDATE THIS VALUE (v2 -> v3) TO FORCE THE UPDATE
const CACHE_NAME = 'rbi-system-v3'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  // Note: Only cache external CDN links if you really need them offline.
  // Ideally, download these files and serve them locally for true offline stability.
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// 1. Install Phase
self.addEventListener('install', (event) => {
  // Forces the waiting service worker to become the active service worker immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for:', CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Phase (Cleanup)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Takes control of the page immediately
      return self.clients.claim();
    })
  );
});

// 3. Fetch Phase
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
