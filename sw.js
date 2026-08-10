/* =========================================================
   sw.js — Service worker giúp ứng dụng chạy được khi mất mạng
   ---------------------------------------------------------
   Đổi CACHE_VERSION mỗi lần phát hành bản mới để trình duyệt
   tải lại toàn bộ tài nguyên thay vì dùng bản đã lưu.
   ========================================================= */
const CACHE_VERSION = 'enquiz-v52';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.en.webmanifest',
  './assets/css/style.css',
  './assets/css/fonts.css',
  './assets/fonts/be-vietnam-pro-400-latin.woff2',
  './assets/fonts/be-vietnam-pro-400-vietnamese.woff2',
  './assets/fonts/be-vietnam-pro-500-latin.woff2',
  './assets/fonts/be-vietnam-pro-500-vietnamese.woff2',
  './assets/fonts/be-vietnam-pro-600-latin.woff2',
  './assets/fonts/be-vietnam-pro-600-vietnamese.woff2',
  './assets/fonts/be-vietnam-pro-700-latin.woff2',
  './assets/fonts/be-vietnam-pro-700-vietnamese.woff2',
  './assets/fonts/bricolage-grotesque-600-latin.woff2',
  './assets/fonts/bricolage-grotesque-600-vietnamese.woff2',
  './assets/fonts/bricolage-grotesque-800-latin.woff2',
  './assets/fonts/bricolage-grotesque-800-vietnamese.woff2',
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
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon-32.png',
  './assets/img/teacher.jpg',
  './assets/img/teacher-wide.jpg',
  './assets/img/mekong-map.webp',
  './assets/img/brand-lockup.webp',
  './assets/img/logo.svg',
  './assets/img/globe.svg',
  './assets/img/huong-welcome.webp',
  './assets/img/huong-quiz.webp',
  './assets/img/huong-cheer.webp',
  './assets/img/class-group.webp',
  './assets/img/video-poster.webp',
  './assets/img/vest-welcome.webp',
  './assets/img/vest-stand.webp',
  './assets/img/vest-point.webp',
  './assets/img/vest-cheer.webp',
  './assets/img/vest-tablet.webp',
  './assets/img/vest-avatar.webp'
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

/* Ghi bản mới vào kho lưu, bỏ qua lỗi để không chặn việc trả kết quả. */
function keep(req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    const copy = res.clone();
    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // để trình duyệt tự xử lý liên kết ngoài

  // Video để trình duyệt tự lo, không đụng vào: tệp nặng hai tư megabyte, giữ
  // lại là chiếm gần hết phần dung lượng ứng dụng được phép dùng. Trình phát
  // còn xin từng đoạn một (Range) để tua, mà kho lưu chỉ trả được cả tệp.
  if (url.pathname.indexOf('/assets/video/') !== -1) return;

  // Trang, mã nguồn và dữ liệu: ưu tiên bản trên mạng để phát hành mới hiện ra
  // ngay, không phải tải lại trang mới thấy. Mất mạng thì lấy bản đã lưu.
  const isShell = req.mode === 'navigate' ||
                  /\.(html|css|js|webmanifest)$/.test(url.pathname) ||
                  url.pathname.endsWith('/');

  if (isShell) {
    event.respondWith(
      fetch(req)
        .then((res) => keep(req, res))
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Ảnh và biểu tượng gần như không đổi: trả bản đã lưu cho nhanh,
  // đồng thời tải bản mới về dùng cho lần sau.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => keep(req, res)).catch(() => cached);
      return cached || network;
    })
  );
});
