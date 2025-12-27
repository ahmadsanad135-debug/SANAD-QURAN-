/* اسم الملف: sw.js */
const CACHE_NAME = 'sanad-quran-cache-v3';

// قائمة الملفات التي سيتم تحميلها فوراً لتشغيل التطبيق بدون نت
// تأكد أن أسماء الملفات هنا تطابق أسماء ملفاتك تماماً (الحروف الكبيرة والصغيرة مهمة)
const ASSETS_TO_CACHE = [
  './',
  './quran.html',
  './quran.js',
  './manifest.json',  // سنقوم بإنشائه في الخطوة التالية
  // أضف هنا أي صور أو أيقونات تستخدمها، مثل:
  // './icon.png',
];

// 1. مرحلة التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  self.skipWaiting(); // تفعيل الخدمة فوراً دون انتظار إغلاق التطبيق
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري تخزين ملفات التطبيق...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. تفعيل الخدمة وحذف الكاش القديم (لتحديث التطبيق عند تغيير الكود)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. استراتيجية "الكاش أولاً" (Cache First Strategy)
// إذا الملف موجود في الجهاز خذه، إذا لا، حمله من النت واحفظه للمرة القادمة
self.addEventListener('fetch', (event) => {
  // تجاوز الطلبات غير المدعومة (مثل chrome-extension)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا وجدنا الملف في الكاش، نعرضه فوراً
      if (cachedResponse) {
        return cachedResponse;
      }

      // إذا لم نجده، نطلبه من الإنترنت
      return fetch(event.request)
        .then((networkResponse) => {
          // التحقق من صحة الاستجابة
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            // ملاحظة: type 'basic' يعني طلبات داخلية، للصوتيات الخارجية قد تحتاج CORS
            // سنقوم بتخزين كل شيء ينجح تحميله
          }

          // نسخ الاستجابة لتخزينها
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // هنا يمكنك وضع صفحة بديلة تظهر إذا انقطع النت ولم يكن الملف مخزناً
          // return caches.match('./offline.html');
          console.log('لا يوجد اتصال ولا يوجد ملف مخزن');
        });
    })
  );
});
