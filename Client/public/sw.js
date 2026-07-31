const CACHE_NAME = "expense-tracker-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/wallet.png",
  "/dollar.png",
  "/expense.png",
  "/bal.png",
];

// Install event: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event: network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // For API requests, use network-first strategy
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the API response
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request).then((cached) => {
            return (
              cached ||
              new Response(
                JSON.stringify({ error: "You are offline" }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                }
              )
            );
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, images), use cache-first strategy
  if (
    event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
            return response;
          })
        );
      })
    );
    return;
  }

  // For navigation requests, serve index.html from cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
          return response;
        })
        .catch(() => {
          return caches.match("/index.html").then((cached) => {
            return cached || caches.match("/");
          });
        })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, cloned);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});