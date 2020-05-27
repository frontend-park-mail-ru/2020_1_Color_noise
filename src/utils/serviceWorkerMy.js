importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
import {CacheFirst, NetworkOnly} from 'workbox-strategies';

workbox.skipWaiting;
workbox.clientsClaim;

// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

workbox.precaching.precacheAndRoute([
    {url: '/', revision: null},
    {url: '/chats', revision: null},
    {url: '/notifications', revision: null},
    {url: '/profile', revision: null},
    {url: '/chat', revision: null},
    {url: '/newPins', revision: null},
    {url: '/main', revision: null},
]);

// запросы к апи - только через сеть
workbox.routing.registerRoute(
    ({url}) => url.pathname.startsWith('/api/'),
    new NetworkOnly()
);

// кешируем все
workbox.routing.registerRoute(
    new RegExp(/(?:png|jpg|jpeg|svg|html|js|css|)/),
    new CacheFirst({
        cacheName: 'My-awesome-cache-imgs-css-spa',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 5, // 5 минут
                maxEntries: 60,
                purgeOnQuotaError: true
            })
        ]
    })
);


