const CACHE_NAME = 'growthring-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './style.css',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Gemini / Claude API 请求不走缓存，直接透传
  if (event.request.url.includes('generativelanguage.googleapis.com') ||
      event.request.url.includes('api.anthropic.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // CDN 资源（Tailwind、FontAwesome、Chart.js）网络优先，失败走缓存
  if (event.request.url.includes('cdn.') || event.request.url.includes('cdnjs.') || event.request.url.includes('fonts.')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 本地资源缓存优先
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
