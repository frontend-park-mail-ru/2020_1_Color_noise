import './styles/index.css'

//import { createCard } from './components/Card/Card';

import {createMainPage} from  './views/createMainPage.js'

import {default as CurrentUser} from './utils/userDataSingl.js';
import { Requests } from './components/Network/Requests.js'

import { createLogin, goNotif, goChats, createReg } from './components/Menu/Menu.js'
import {createProfile} from "./components/Profile/Profile.js";
import {createProfileSettings} from "./components/ProfileSettings/ProfileSettings.js";
import {changeLocation} from "./utils/changeLocation.js";


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
            } else {
                Requests.getUserProfile(createMainPage);
                createReg()
            }
            return
        }
        case '/autorization': {
            Requests.getUserProfile(createMainPage);
            if ( CurrentUser.Data.login === 'null') {
                createLogin(); // createAutorization()
            }
            return;
        }
        case '/profile': {
            Requests.getUserProfile(createMainPage);
            createProfile();
            break;
        }
        case '/profileSettings': {
            Requests.getUserProfile(createProfileSettings);
            break;
        }
        case '/chats': {
            Requests.getUserProfile(createMainPage);
            goChats();
            break;
        }
        case '/notif': {
            Requests.getUserProfile(createMainPage);
            goNotif();
            break;
        }

        default: {

            Requests.getUserProfile(createMainPage);
            // убрать везде getUserProfile(createMainPage); и запрос после
            // перед showPage построим меню и потом уже контент

        }
        // @todo add new pages
    }
}

showPage();

// "/pin/" + target.id   страница пина
// changeLocation("/follows","follows"); // mb goFollows()
// changeLocation("/main","main"); createDesk


//changeLocation('/profile','Profile'); goProfile()