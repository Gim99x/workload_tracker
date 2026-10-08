const VERSION = 'workload-v1';           // bump this to force clients to refresh the cache
const SHELL = ['./', './index.html', './manifest.json'];
const CDN = ['https://cdn.tailwindcss.com'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    // Third-party script: fetched no-cors so it can be stored even without CORS headers
    await Promise.all(CDN.map(url =>
      fetch(url, { mode: 'no-cors' }).then(res => cache.put(url, res)).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Page loads: serve the cached shell instantly, even with no network
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(hit => hit || fetch(req))
    );
    return;
  }

  // Everything else: cache first, then network (and remember what we fetched)
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
