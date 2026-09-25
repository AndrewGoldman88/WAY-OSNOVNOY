const CACHE_NAME = "put-shell-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/main.css",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./js/data.js",
  "./js/state.js",
  "./js/auth.js",
  "./js/app-lock.js",
  "./js/theme.js",
  "./js/cosmetics.js",
  "./js/particles.js",
  "./js/matrix-rain.js",
  "./js/parallax.js",
  "./js/quotes.js",
  "./js/home.js",
  "./js/mood.js",
  "./js/journal.js",
  "./js/calendar.js",
  "./js/stats.js",
  "./js/ranks.js",
  "./js/navigation.js",
  "./js/modals.js",
  "./js/relapse.js",
  "./js/sex-log.js",
  "./js/wheel.js",
  "./js/onboarding.js",
  "./js/utils.js",
  "./js/backup.js",
  "./js/init.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // App files: network first so updates show up immediately, cache as fallback (offline mode).
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
    );
    return;
  }

  // External resources (for example fonts): network first, cached fallback.
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
