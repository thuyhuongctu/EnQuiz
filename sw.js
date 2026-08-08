/* =========================================================
   sw.js — Service worker giúp ứng dụng chạy được khi mất mạng
   ---------------------------------------------------------
   Đổi CACHE_VERSION mỗi lần phát hành bản mới để trình duyệt
   tải lại toàn bộ tài nguyên thay vì dùng bản đã lưu.
   ========================================================= */
const CACHE_VERSION = 'enquiz-v5';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/js/i18n.js',
  './assets/js/storage.js',
  './assets/js/bank.js',
  './assets/js/parser.js',
  './assets/js/tour.js',
  './assets/js/app.js',
  './data/manifest.js',
  './data/ch01.js',
  './data/ch02.js',
  './data/ch03.js',
  './data/ch04.js',
  './data/ch05.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon-32.png',
  './assets/img/teacher.jpg',
  './assets/img/teacher-wide.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // addAll thất bại toàn bộ nếu một tệp lỗi, nên nạp từng tệp riêng
      .then((cache) => Promise.all(
        SHELL.map((url) => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // để trình duyệt tự xử lý liên kết ngoài

  // Trả bản đã lưu ngay cho nhanh, đồng thời tải bản mới về cho lần sau.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
