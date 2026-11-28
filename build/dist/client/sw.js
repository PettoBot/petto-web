// Petto's service worker, kept tiny on purpose. It makes the installed app show a clean page when there is no connection, and nothing else:
// it never keeps a page of the dashboard or of the site (they change all the time and must always come from the server), and it does not
// touch scripts, images, API calls or forms. Change CACHE to publish a new offline page.
const CACHE = 'petto-offline-1';
const OFFLINE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE, '/assets/pwa/icon-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Only a page the person opens, and only when the network fails.
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE).then((page) => page || Response.error())));
});
