// Offline cache: serves the app from the iPad and checks GitHub for a newer version when online.
const CACHE = 'flight-checklists-v27';
const ASSETS = ['./', './index.html', './airports.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's HTTP cache, so a new version never stores stale files
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const nav = req.mode === 'navigate';
  const key = nav ? './index.html' : req;
  const fresh = nav ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(req, { cache: 'no-cache' });
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(fresh).then(res => {
      if (res && res.ok) cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) return cached;
    return (await network) || cache.match('./index.html');
  }));
});
