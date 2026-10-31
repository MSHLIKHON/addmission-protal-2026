/**
 * sw.js - Service Worker for Admission Portal 2026-2027
 * Cache-first strategy for static resources, enabling offline usability.
 */
const CACHE_NAME = 'admission-portal-2026-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/main.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/animations.css',
  './js/app.js',
  './js/data/constants.js',
  './js/data/universities.data.js',
  './js/data/units.data.js',
  './js/data/notices.data.js',
  './js/data/checklist.data.js',
  './js/data/marks.data.js',
  './js/utils/bengali.utils.js',
  './js/utils/date.utils.js',
  './js/utils/dom.utils.js',
  './js/utils/crypto.utils.js',
  './js/state/state.js',
  './js/features/countdown/countdown.js',
  './js/features/directory/kpi.js',
  './js/features/directory/directory.js',
  './js/features/timeline/timeline.js',
  './js/features/calendar/calendar.js',
  './js/features/targets/targets.js',
  './js/features/credentials/credentials.js',
  './js/features/eligibility/eligibility.js',
  './js/features/guide/guide.js',
  './js/features/circular-parser/parser.js',
  './js/features/export/export.js',
  './js/features/hsc-result/hsc-result.js',
  './js/features/marks/marks.js',
  './js/features/backup/backup.js',
  './js/features/calendar-sync/calendar-sync.js',
  './js/modals/modal-manager.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Pre-caching partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached and refresh in background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
