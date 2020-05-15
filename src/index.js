import './index.css'
import Router from "./utils/router.js"
import {createOfflinePage} from "./components/OfflinePage/OfflinePage.js"

import {registerServiceWorker} from "./utils/serviceWorker.js"


//registerServiceWorker();


Router.start();
