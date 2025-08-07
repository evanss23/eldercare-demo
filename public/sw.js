// Service Worker for ElderCare App
const CACHE_NAME = 'eldercare-v1';
const RUNTIME_CACHE = 'eldercare-runtime';
const IMAGE_CACHE = 'eldercare-images';
const API_CACHE = 'eldercare-api';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/elder',
  '/caregiver',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            cacheName !== CACHE_NAME && 
            cacheName !== RUNTIME_CACHE && 
            cacheName !== IMAGE_CACHE &&
            cacheName !== API_CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Fallback to cache
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return error response
          return new Response(
            JSON.stringify({ error: 'Offline', message: 'No cached data available' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })
    );
    return;
  }

  // Handle image requests - Cache First
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // Return placeholder image
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#f0f0f0" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      })
    );
    return;
  }

  // Handle static assets - Cache First with Network Fallback
  if (url.pathname.match(/\.(js|css|woff2?)$/i)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle navigation requests - Network First with Offline Page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Default - Network First
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-memories') {
    event.waitUntil(syncMemories());
  }
});

async function syncMemories() {
  // Get pending uploads from IndexedDB
  const pendingUploads = await getPendingUploads();
  
  for (const upload of pendingUploads) {
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        body: JSON.stringify(upload),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        await removePendingUpload(upload.id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingUploads() {
  // Implementation would retrieve from IndexedDB
  return [];
}

async function removePendingUpload(id) {
  // Implementation would remove from IndexedDB
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  // Prefetch critical API data
  const criticalEndpoints = [
    '/api/profile',
    '/api/memories/recent',
    '/api/wellness/status'
  ];

  const cache = await caches.open(API_CACHE);
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        await cache.put(endpoint, response);
      }
    } catch (error) {
      console.error('Update failed for', endpoint);
    }
  }
}