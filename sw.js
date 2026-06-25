const CACHE_NAME = "vesselguard-cache-v1";

const PRECACHE_URLS = [
  "login.html",
  "register.html",
  "dashboard.html",
  "prediction.html",
  "result.html",
  "analytics.html",
  "css/style.css",
  "js/config.js",
  "js/login.js",
  "js/register.js",
  "js/dashboard.js",
  "js/prediction.js",
  "js/result.js",
  "js/analytics.js",
  "js/pwa.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls - always go to network so data stays live
  if (url.pathname.startsWith("/api/") || event.request.url.includes(":8080") || event.request.url.includes(":5001")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && event.request.method === "GET") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
