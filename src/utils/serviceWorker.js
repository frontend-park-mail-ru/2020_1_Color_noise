import {createOfflinePage} from "../components/OfflinePage/OfflinePage";

import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';

let serverWorkerISRegister = false;

export function registerServiceWorker() {

    if (serverWorkerISRegister) {
        return;
    }

    if ('serviceWorker' in navigator) {

        window.addEventListener("load", () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then( obj => {
                    console.log("serviceWorker register 2!")
                    serverWorkerISRegister = true;
                    //console.log("obj:", obj)
                })
                .catch(err => {
                    console.log("serviceWorker err:", err)
                });
            if (!navigator.onLine) {
                console.log("offline load path:", window.location.pathname)
                createOfflinePage(window.location.pathname, document.title);
            }

        });


    /*
        registerRoute(
            ({request}) => request.destination === 'chats',
            // Use a cache-first strategy with the following config:
            new CacheFirst({
                // You need to provide a cache name when using expiration.
                cacheName: '/',
                plugins: [
                    new ExpirationPlugin({
                        // Keep at most 50 entries.
                        maxEntries: 50,
                        // Don't keep any entries for more than 30 days.
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        // Automatically cleanup if quota is exceeded.
                        purgeOnQuotaError: true,
                    }),
                ],
            }),
        );
     */


    }












}