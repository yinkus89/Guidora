/* Guidora Service Worker — runtime caching */
const CACHE_NAME = "guidora-cache-v1";

// URLs we definitely want available offline
const APP_SHELL = [
  "/",               // SPA entry
  "/index.html",
  "/manifest.webmanifest",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pwa-512x512-maskable.png",
];

// Take control asap
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Strategy:
// - Navigation (HTML): network-first with offline fallback to cached index.html
// - Static assets (script/style/font/image): cache-first
// - Other requests: network-first
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Handle SPA navigations
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          // Optionally cache a copy of index on success
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("/")) || (await cache.match("/index.html"));
        }
      })()
    );
    return;
  }

  // Static assets cache-first
  const dest = req.destination;
  if (["style", "script", "font", "image"].includes(dest)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const resp = await fetch(req);
          if (resp && resp.ok) cache.put(req, resp.clone());
          return resp;
        } catch {
          // last-resort: return cache if any
          return hit || Response.error();
        }
      })()
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    (async () => {
      try {
        const resp = await fetch(req);
        return resp;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const hit = await cache.match(req);
        return hit || Response.error();
      }
    })()
  );
});
