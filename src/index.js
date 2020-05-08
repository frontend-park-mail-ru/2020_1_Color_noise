import './index.css'
import Router from "./utils/router.js"

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {

        // 'service-worker.js'
        //'http://localhost:8080' +'/public/service-worker.js'
        navigator.serviceWorker.register('service-worker.js')
            .then( obj => {
                console.log("serviceWorker register!")
                console.log("obj:", obj)
            })
            .catch(err => {
                console.log("serviceWorker err:", err)
            });
    });
}




Router.start();
