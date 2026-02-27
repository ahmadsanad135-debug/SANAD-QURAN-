/* اسم الملف: sw.js */
const CACHE_NAME = 'sanad-quran-cache-v7'; // تم تحديث الإصدار

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quran.html',
  './surahLinks.js',
  './manifest.json',
  './icon.png' // تأكد من وجود صورة بهذا الاسم في مجلدك
];

// مرحلة التثبيت
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// استراتيجية جلب الملفات
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // تخزين الملفات الجديدة تلقائياً (مثل أصوات القراء إذا سمحت المساحة)
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log('فشل الاتصال بالإنترنت والملف غير مخزن');
      });
    })
  );
});
 
