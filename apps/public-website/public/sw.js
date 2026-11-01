// Nginda Warriors FC — Service Worker (Always-Fresh Network-First with Offline Fallback)
const CACHE_NAME = 'nginda-warriors-v3-fresh';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/offline.html', '/manifest.json']).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Skip non-GET, admin control centre, api routes, and dynamic uploads
  if (
    req.method !== 'GET' ||
    url.pathname.startsWith('/manage') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/uploads')
  ) {
    return;
  }

  // 2. HTML navigation: STRICT NETWORK-FIRST (Always fetch live from server)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-cache' })
        .catch(async () => {
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

  // 3. Static assets: Network-first, only fallback to cache if network fails
  event.respondWith(
    fetch(req).catch(() => {
      return caches.match(req);
    })
  );
});

// Push notifications support
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'Nginda Warriors FC';
    const options = {
      body: data.body || 'New update from Nginda Warriors FC',
      icon: '/brand/nginda-warriors-crest.svg',
      badge: '/brand/nginda-warriors-crest.svg',
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
