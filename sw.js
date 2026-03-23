const CACHE_NAME = 'food-guide-v1';

const ASSETS_TO_CACHE = [

  './',

  './index.html',

  './manifest.json',

  './app.js'

  // Bootstrap i Leaflet są pobierane z CDN, więc na potrzeby prostego MVP 

  // skupiamy się na podstawowych plikach lokalnych.

];
 
// Instalacja Service Workera i zapisanie plików do pamięci podręcznej

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        console.log('Pliki skeszowane pomyślnie');

        return cache.addAll(ASSETS_TO_CACHE);

      })

  );

});
 
// Zwracanie plików z cache, gdy nie ma internetu (tryb offline)

self.addEventListener('fetch', event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        // Zwróć z cache, jeśli istnieje. W przeciwnym razie pobierz z sieci.

        return response || fetch(event.request);

      })

  );

});
 