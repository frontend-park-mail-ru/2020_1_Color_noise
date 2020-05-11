import './index.css'
import Router from "./utils/router.js"
import {createOfflinePage} from "./components/OfflinePage/OfflinePage.js"
import * as navigationPreload from 'workbox-navigation-preload';
import {registerRoute, NavigationRoute} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';



if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('service-worker.js')
            .then( obj => {
                console.log("serviceWorker register!")
                //console.log("obj:", obj)
            })
            .catch(err => {
                console.log("serviceWorker err:", err)
            });


        const CACHE_NAME = '/'; // добавляется в кеш при загрузки главной
        const FALLBACK_HTML_URL = '/';
        self.addEventListener('install', async (event) => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then((cache) => cache.add(FALLBACK_HTML_URL))
            );
        });

        navigationPreload.enable();

        const networkOnly = new NetworkOnly();
        const navigationHandler = async (params) => {
            try {
                // Attempt a network request.
                return await networkOnly.handle(params);
            } catch (error) {
                // If it fails, return the cached HTML.
                return caches.match(FALLBACK_HTML_URL, {
                    cacheName: CACHE_NAME,
                });
            }
        };

// Register this strategy to handle all navigations.
        registerRoute(
            new NavigationRoute(navigationHandler)
        );




        if (!navigator.onLine) {
            console.log("offline load path:", window.location.pathname)
            createOfflinePage(window.location.pathname, document.title);
        }





    });
}




Router.start();
