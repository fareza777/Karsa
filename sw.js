/* ===== KARSA — Service Worker (offline shell) ===== */
const CACHE = 'karsa-v3';

// Aset inti yang dipracache agar app bisa dibuka offline
const CORE = [
  '/app',
  '/app.html',
  '/css/base.css',
  '/css/components.css',
  '/css/dashboard.css',
  '/css/ide.css',
  '/css/ai.css',
  '/css/palette.css',
  '/icon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE).catch(() => { /* sebagian boleh gagal */ }))
    // Catatan: TIDAK skipWaiting otomatis — app yang memutuskan kapan update
    // diterapkan (lewat tombol "Muat ulang"), agar tab terbuka tak tiba-tiba
    // berganti aset di tengah kerja.
  );
});

// App mengirim pesan SKIP_WAITING saat user klik "Muat ulang versi baru".
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // /api → selalu jaringan (jangan pernah cache respons AI/publish)
  if (url.pathname.startsWith('/api/')) return;

  // Navigasi (HTML) → network-first, fallback cache (offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { cachePut(req, res.clone()); return res; })
        .catch(() => caches.match(req).then((c) => c || caches.match('/app.html')))
    );
    return;
  }

  // Aset statis (same-origin atau CDN) → stale-while-revalidate
  if (url.origin === location.origin || /cdnjs|jsdelivr|fonts\.(googleapis|gstatic)/.test(url.host)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => { cachePut(req, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

function cachePut(req, res) {
  if (!res || res.status !== 200 || res.type === 'opaque') return;
  caches.open(CACHE).then((cache) => cache.put(req, res)).catch(() => {});
}
