/* Guidora Service Worker — runtime caching */
const CACHE_NAME = "guidora-cache-v1";

// Make sure these match files in /public and your manifest!
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pwa-512x512-maskable.png"
]
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Allow page to request immediate activation
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Strategy:
// - Navigation (HTML): network-first with offline fallback to cached index.html
// - Static assets (script/style/font/image): cache-first
// - Other requests: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // App navigations (SPA)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          // cache the actual navigated URL
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          // try navigated URL, then /, then /index.html
          return (
            (await cache.match(req)) ||
            (await cache.match("/")) ||
            (await cache.match("/index.html"))
          );
        }
      })()
    );
    return;
  }

  // Static assets: cache-first
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
          return hit || Response.error();
        }
      })()
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const hit = await cache.match(req);
        return hit || Response.error();
      }
    })()
  );
});
