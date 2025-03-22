// Cache version
const CACHE_NAME = 'skincede-cache-v1';

// Resources to cache immediately
const PRECACHE_RESOURCES = [
  '/',
  '/products',
  '/category/all',
  '/css/main.css',
  '/js/main.js',
  '/images/logo.png',
  // Add critical assets
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_RESOURCES);
      })
  );
});

// Fetch event - serve from cache when available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 