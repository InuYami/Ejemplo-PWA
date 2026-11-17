const CACHE = 'cache-2';
const CACHE_DINAMICO = 'dinamico-1';
const CACHE_ESTATICO = 'estatico-1';
const CACHE_INMUTABLE = 'inmutable-1';

self.addEventListener('install', evento => {
    const cacheBase = caches.open(CACHE)
        .then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './img/main.jpg',
                './js/app.js',
                './img/no-img.jpeg',
                './pages/offline.html',
                './manifest.json',
                './iconos/128x128.png',
                './iconos/144x144.png',
                './iconos/152x152.png',
                '/iconos/384x384.png',
                './iconos/512x512.png'
            ]);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => {
            // Agregado el 'return' que faltaba
            return cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
        });

    evento.waitUntil(Promise.all([cacheBase, cacheInmutable]));
});

function limpiarCache(nombreCache, numeroItems) {
    caches.open(nombreCache)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItems) {
                        // Corregido: se pasa como arrow function para esperar a que borre
                        cache.delete(keys[0])
                            .then(() => limpiarCache(nombreCache, numeroItems));
                    }
                });
        });
}

self.addEventListener('fetch', evento => {
    const respuesta = caches.match(evento.request)
        .then(res => {
            if (res) return res;

            console.log('No existe en cache, yendo a la web:', evento.request.url);

            return fetch(evento.request)
                .then(resWeb => {
                    // Validamos que la respuesta sea válida antes de guardar en caché dinámico
                    if (!resWeb || resWeb.status !== 200) {
                        return resWeb;
                    }

                    // Clonamos ANTES de meterlo al proceso asíncrono del cache
                    const resClonada = resWeb.clone();

                    caches.open(CACHE_DINAMICO)
                        .then(cache => {
                            cache.put(evento.request, resClonada);
                            limpiarCache(CACHE_DINAMICO, 2);
                        });

                    return resWeb;
                });
        })
        .catch(err => {
            if (evento.request.headers.get('accept').includes('text/html')) {
                // Corregido para que coincida con lo que guardaste en cacheBase
                return caches.match('./offline.html');
            }
        });

    evento.respondWith(respuesta);
});