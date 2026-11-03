// Nginda Warriors FC — High-Performance, Zero-Memory-Leak Service Worker
const CACHE_NAME = 'nginda-warriors-v10-clean';
const OFFLINE_URL = '/offline.html';

const STATIC_PRECACHE = [
  '/offline.html',
  '/manifest.json',
  '/favicon.png',
  '/brand/nginda-warriors-crest.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  // Purge every old, bloated cache from previous sessions immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging bloated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1. Only process GET requests from same origin; never intercept cross-origin or non-GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 2. Skip admin dashboard, API endpoints, dynamic uploads, Next.js internal RSC streams
  if (
    url.pathname.startsWith('/manage') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/uploads') ||
    url.searchParams.has('_rsc') ||
    req.headers.get('RSC') === '1'
  ) {
    return;
  }

  // 3. HTML Navigation requests: Network-first, fallback to /offline.html on network failure
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const offline = await caches.match(OFFLINE_URL);
        return offline || new Response('Offline - Nginda Warriors FC', {
          headers: { 'Content-Type': 'text/html' },
        });
      })
    );
    return;
  }

  // 4. Offline precache assets only (offline.html, manifest, icon)
  if (STATIC_PRECACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  // 5. All other static assets (JS chunks, CSS, fonts, images):
  // Let the browser's native C++ HTTP engine handle them directly with zero JS heap/memory overhead!
});

// Push notifications support
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'Nginda Warriors FC';
    const options = {
      body: data.body || 'New update from Nginda Warriors FC',
      icon: '/brand/nginda-warriors-crest.png',
      badge: '/brand/nginda-warriors-crest.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    // ignore
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
