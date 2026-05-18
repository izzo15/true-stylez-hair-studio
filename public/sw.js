const CACHE_NAME = 'truestylez-cache-v1'
const OFFLINE_URL = '/offline.html'
const ASSETS_TO_CACHE = [
  '/offline.html',
  '/manifest.json',
  '/og-image.jpg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).catch(() => {
          if (request.destination === 'image') {
            return new Response('', { status: 200 })
          }
        })
      })
    )
  }
})