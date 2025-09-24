// Plan-Eat Service Worker
const CACHE_NAME = 'plan-eat-v1';
const STATIC_CACHE = 'plan-eat-static-v1';
const DYNAMIC_CACHE = 'plan-eat-dynamic-v1';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/planification',
  '/preferences',
  '/shopping-list',
  '/manifest.json',
  // Ajoutez d'autres ressources statiques critiques
];

// Ressources de l'API à mettre en cache
const API_ROUTES = [
  '/api/auth/me',
  '/api/recipes/public',
  '/api/meal-plans'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Plan-Eat SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Plan-Eat SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Plan-Eat SW: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Plan-Eat SW: Installation failed', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Plan-Eat SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Plan-Eat SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Plan-Eat SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie pour les pages HTML (Network First)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse si elle est valide
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback vers le cache si le réseau échoue
          return caches.match(request)
            .then((response) => {
              return response || caches.match('/');
            });
        })
    );
    return;
  }
  
  // Stratégie pour les API (Network First avec timeout)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      Promise.race([
        fetch(request),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])
        .then((response) => {
          // Cache les réponses API réussies (GET uniquement)
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback vers le cache pour les requêtes GET
          if (request.method === 'GET') {
            return caches.match(request);
          }
          // Pour les autres méthodes, retourner une erreur
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }
  
  // Stratégie pour les ressources statiques (Cache First)
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image' ||
      url.pathname.includes('/icons/') ||
      url.pathname.includes('/_next/static/')) {
    
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }
  
  // Stratégie par défaut (Network First)
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => {
        event.ports[0].postMessage({ success: true });
      });
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Plan-Eat SW: Background sync triggered');
    // Ici vous pouvez ajouter la logique pour synchroniser les données
    // par exemple, envoyer les données mises en cache quand la connexion revient
  }
});

// Notifications push (optionnel)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Votre plan de repas est prêt !',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'Voir',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Plan-Eat', options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/planification')
    );
  }
});

console.log('Plan-Eat Service Worker loaded successfully');
