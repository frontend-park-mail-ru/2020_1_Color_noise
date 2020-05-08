import './index.css'
import Router from "./utils/router.js"

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {

        // 'service-worker.js'
        //'http://localhost:8080' +'/public/service-worker.js'
        navigator.serviceWorker.register('service-worker.js')
            .then(console.log)
            .catch(console.error);
    });
}




Router.start();
