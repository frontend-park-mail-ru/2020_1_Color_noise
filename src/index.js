import './styles/index.css'

//import { createCard } from './components/Card/Card';

import {createMainPage} from  './views/createMainPage.js'

import {default as CurrentUser} from './utils/userDataSingl.js';
import { Requests } from './components/Network/Requests.js'

import { createLogin } from './components/Menu/Menu.js'
import {createProfile} from "./components/Profile/Profile.js";
import {createProfileSettings} from "./components/ProfileSettings/ProfileSettings.js";

/**
 *  router
 *
 * @return {void}
 */
function showPage() {
    const url = window.location.pathname;
    switch (url) {
        // @todo  add regular expr
        case '': {
            Requests.getUserProfile(createMainPage);
            break;
        }
        case '/': {
            Requests.getUserProfile(createMainPage);
            break;
        }
        case '/main': {
            Requests.getUserProfile(createMainPage);
            break;
        }
        case '/registration': {
            if ( CurrentUser.Data.login !== 'null') {
                Requests.getUserProfile(createMainPage);
            }
                break;
            // @todo create reg here
            break;
        }
        case '/login': {
            if ( CurrentUser.Data.login === 'null') {
                createLogin();
                return;
            }
            Requests.getUserProfile(createMainPage);
            return;
        }
        case '/profile': {
            Requests.getUserProfile(createProfile);
            break;
        }
        case '/profileSettings': {
            Requests.getUserProfile(createProfileSettings);
            break;
        }
        default: {
            Requests.getUserProfile(createMainPage);
        }
        // @todo add new pages
    }
}

showPage();