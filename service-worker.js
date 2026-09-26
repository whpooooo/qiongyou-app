const CACHE_VERSION = 'qiongyou-pwa-v1';
const APP_SHELL = [
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/images/hero-journey.svg',
  './assets/images/route-city.svg',
  './assets/images/route-coast.svg',
  './assets/images/route-desert.svg',
  './assets/images/route-garden.svg',
  './assets/images/route-grassland.svg',
  './assets/images/route-mountain.svg',
  './assets/images/route-old-town.svg',
  './assets/images/route-plateau.svg',
  './index.html',
  './js/app.js',
  './js/core/analytics.js',
  './js/core/community.js',
  './js/core/constants.js',
  './js/core/planner.js',
  './js/core/provider.js',
  './js/core/recommender.js',
  './js/core/store.js',
  './js/core/utils.js',
  './js/core/visuals.js',
  './js/data/cities.js',
  './js/data/community.js',
  './js/data/routes.js',
  './js/ui/community.js',
  './js/ui/home.js',
  './js/ui/my.js',
  './js/ui/next.js',
  './js/ui/plans.js',
  './js/ui/routes.js',
  './manifest.webmanifest',
  './styles.css'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) { return cache.addAll(APP_SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_VERSION) return caches.delete(key);
        return Promise.resolve(false);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_VERSION).then(function (cache) { cache.put(request, copy); });
        return response;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      });
    })
  );
});