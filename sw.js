const CACHE_NAME = 'quran-app-v2';

// 1. القائمة الأساسية للملفات (تأكد من مطابقة الأسماء لملفاتك)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quran.html',
  './style.css',      // ملف التنسيق المسؤول عن الخط
  './script.js',     // ملف البرمجة الخاص بك
  './manifest.json'
];

// مرحلة التثبيت: حفظ الملفات الأساسية
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('جاري حفظ ملفات النظام...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// مرحلة الاستجابة: جلب الملفات من الكاش أو حفظها عند التشغيل
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // إذا كان الملف مخزناً، استعرضه فوراً
      if (response) {
        return response;
      }

      // إذا لم يكن مخزناً، اطلبه من الإنترنت
      return fetch(e.request).then(networkResponse => {
        // إذا كان الطلب ناجحاً، احفظ نسخة منه (خاصة للصوتيات)
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حال انقطاع النت تماماً وعدم وجود الملف في الكاش
        console.log('لا يوجد اتصال بالإنترنت لهذا الملف.');
      });
    })
  );
});
