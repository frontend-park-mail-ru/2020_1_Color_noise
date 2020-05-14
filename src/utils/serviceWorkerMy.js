
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

import {NavigationRoute, registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {createHandlerBoundToURL } from 'workbox-precaching';



workbox.skipWaiting;
workbox.clientsClaim;


// cache name
// workbox.core.setCacheNameDetails({
//     prefix: 'My-awesome-cache',
//     precache: 'precache',
//     runtime: 'runtime',
// });




// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)


// первый вариант
// https://developers.google.com/web/tools/workbox/guides/precache-files/webpack
// workbox.precaching.precacheAndRoute(self.__precacheManifest || []);


// второй вариант
workbox.precaching.precacheAndRoute([
    {url: '/', revision: null},
    {url: '/chats', revision: null},
    {url: '/notifications', revision: null},
    {url: '/profile', revision: null},
    {url: '/chatnewPins', revision: null},
]);


//     {
//    cleanUrls: true,
//  });





console.log("try to set default route to /")
// роутинг для SPA
// https://developers.google.com/web/tools/workbox/modules/workbox-routing
// This assumes / has been precached.
// const handler = createHandlerBoundToURL('/');
// const navigationRoute = new NavigationRoute(handler);
// workbox.routing.registerRoute(navigationRoute);





// кешируем все
// запросы страниц chats|notifications|profile|newPin кешируются только при обновлении страницы, где будет их url
// запросы для страниц, которые не кешировались перезагрузкой должны отдаваться из кеша для SPA
workbox.routing.registerRoute(
    new RegExp(/(?:png|jpg|jpeg|svg|html|js|css|)/),
    new CacheFirst({
        cacheName: 'My-awesome-cache-imgs-css-spa',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 50,
                purgeOnQuotaError: true
            })
        ]
    })
);

