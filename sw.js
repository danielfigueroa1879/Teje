// Service Worker - Tejidos Luna PWA
const CACHE_NAME = 'tejidos-luna-v2';

// Archivos esenciales para funcionamiento offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/menu-script.js',
  // Favicon folder — iconos de instalación
  '/favicon/site.webmanifest',
  '/favicon/favicon.ico',
  '/favicon/favicon.svg',
  '/favicon/favicon-96x96.png',
  '/favicon/apple-touch-icon.png',
  '/favicon/web-app-manifest-192x192.png',
  '/favicon/web-app-manifest-512x512.png',
  // Imágenes del sitio
  '/Fotos/luna.png',
  '/Fotos/bailarina1.png',
  '/Fotos/su.jpg',
  '/Fotos/tejido.jpg',
  '/Fotos/trajeMujer.jpg'
  // Los videos NO se cachean por su gran tamaño
];

// Instalación: guarda los archivos estáticos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch((err) => {
      console.warn('SW: Error al cachear algunos archivos:', err);
    })
  );
  self.skipWaiting();
});

// Activación: elimina cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estrategia: Network First para HTML, Cache First para estáticos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo maneja solicitudes del mismo origen
  if (url.origin !== location.origin) return;

  // Videos: siempre desde red (demasiado grandes para caché)
  if (url.pathname.match(/\.(mp4|webm|ogg)$/i)) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // HTML: Network First (siempre muestra versión actualizada si hay red)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Resto: Cache First (imágenes, CSS, JS)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => new Response('', { status: 503 }));
    })
  );
});
