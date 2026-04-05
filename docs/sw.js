self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    let notifTitle = 'Bogor Kasohor';
    let notifBody = 'Ada cerita baru dari warga Bogor!';
    let notifIcon = '/favicon.ico';
    let urlTujuan = '/#/';

    if (event.data) {
      try {
        const payload = event.data.json();
        console.log('Data dari API:', payload);

        notifTitle = payload.title || notifTitle;
        notifBody = payload.message || payload.body || notifBody;
        notifIcon = payload.icon || notifIcon;

        if (payload.id) {
          urlTujuan = `/#/detail/${payload.id}`;
        }
      } catch (error) {
        notifBody = event.data.text();
      }
    }

    const options = {
      body: notifBody,
      icon: notifIcon,
      badge: '/favicon.ico',
      data: {
        url: urlTujuan,
      },
      actions: [
        {
          action: 'baca-cerita',
          title: 'Buka Aplikasi',
        },
      ],
    };

    await self.registration.showNotification(notifTitle, options);
  }

  event.waitUntil(chainPromise());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

const CACHE_NAME = 'bogor-kasohor-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker: Terinstal');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache lama', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  if (event.request.url.includes('story-api.dicoding.dev')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
