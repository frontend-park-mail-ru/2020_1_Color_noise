import {createOfflinePage} from "../components/OfflinePage/OfflinePage";


export function registerServiceWorker() {

    if ('serviceWorker' in navigator) {

        window.addEventListener("load", () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then( obj => {
                    console.log("serviceWorker register!")
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
    }
}