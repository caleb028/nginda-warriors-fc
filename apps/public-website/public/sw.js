// Nginda Warriors FC — Zero-Overhead, High-Security Service Worker
// Fetch interception is disabled to guarantee zero thread latency, zero hanging, and 100% native C++ browser navigation.
const CACHE_NAME = 'nginda-warriors-v11-clean';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purge every old, bloated cache from previous sessions immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[SW] Purging bloated cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Push notifications support (zero fetch overhead)
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
