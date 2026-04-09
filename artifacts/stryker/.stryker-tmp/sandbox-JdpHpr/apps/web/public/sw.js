// @ts-nocheck
// 
const CACHE_NAME = "birthhub-pwa-v2";
const PRECACHE_URLS = ["/", "/offline", "/manifest.json", "/brand/birthhub360-mark.svg"];
const STATIC_ASSET_PATTERN = /\.(?:css|ico|js|mjs|png|svg|webp)$/;
const FETCH_TIMEOUT_MS = 8_000;

async function fetchWithTimeout(request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(request, {
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetchWithTimeout(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetchWithTimeout(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? caches.match("/offline");
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isSameOrigin && STATIC_ASSET_PATTERN.test(requestUrl.pathname)) {
    event.respondWith(cacheFirst(event.request));
  }
});
