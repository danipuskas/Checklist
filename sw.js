// Offline cache: serves the app from the iPad and checks GitHub for a newer version when online.
const CACHE = 'flight-checklists-v52';
const ASSETS = ['./', './index.html', './airports.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './lib/pdf.js', './lib/pdf.worker.js'];

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
  const cacheP = caches.open(CACHE);
  const cachedP = cacheP.then(c => c.match(key, { ignoreSearch: true })).catch(() => null);
  // Refresh the stored copy in the background. Nothing waits for it, so a slow or captive
  // hotel network never holds up the app; waitUntil lets it finish even after the app has its answer.
  let netP = null, putP = null;
  const refresh = () => netP || (netP = fetch(nav ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(req, { cache: 'no-cache' }))
    .then(res => {
      // a redirected copy is never stored: iPadOS won't open the app from one
      if (res && res.ok && !res.redirected) { const copy = res.clone(); putP = cacheP.then(c => c.put(key, copy)).catch(() => {}); }
      return res;
    })
    .catch(() => null));
  // Answer from the iPad first; go to the network only when this file isn't stored yet
  e.respondWith(cachedP.then(cached => cached || refresh().then(res => res || cacheP.then(c => c.match('./index.html')))));
  e.waitUntil(cachedP.then(cached => cached ? refresh() : netP).then(() => putP).catch(() => {}));
});
