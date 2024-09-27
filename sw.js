const CACHE_NAME = 'christmas-pwa-v1';
const assetsToCache = [
  '/',                        // The root directory (index.html)
  '/index.html',              // Your main HTML file
  '/css/styles.css',           // Your custom styles
  '/img/IMG_0600.jpeg',        // Your snowflake image (make sure this path is correct)
  '/js/app.js',                // Any JavaScript file you have
  '/manifest.webmanifest',     // Your PWA manifest file
  '/https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',  // Google Font
];

// Install event - Caches all the specified assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets...');
        return cache.addAll(assetsToCache);
      })
      .then(() => self.skipWaiting())  // Activate the new service worker immediately
  );
});

// Activate event - Clears old caches if there are any
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();  // Activate the service worker immediately on all clients
});

// Fetch event - Serve cached files if available, else fetch from the network
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching...');
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached asset if available, otherwise fetch it
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback if both cache and network fail (optional)
      return caches.match('/index.html');  // Serve index.html as fallback if needed
    })
  );
});
