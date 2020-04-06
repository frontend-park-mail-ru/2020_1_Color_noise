import './styles/index.css'

//import { createCard } from './components/Card/Card';

import {createMainPage} from  './views/createMainPage.js'

import {default as CurrentUser} from './utils/userDataSingl.js';
import { Requests } from './components/Network/Requests.js'

import { createLogin, goNotif, goChats, createReg } from './components/Menu/Menu.js'
import {createProfile} from "./components/Profile/Profile.js";
import {createProfileSettings} from "./components/ProfileSettings/ProfileSettings.js";
import {changeLocation} from "./utils/changeLocation.js";
import {createContent} from "./components/Content/Content.js";
import {createMenu} from "./components/Menu/Menu.js";
import {createDesk} from "./components/Desk/Desk.js";
import { createPinPageFromRequest } from "./components/Pin/Pin.js";


/**
 *  isInteger
 *  check string
 *  @param {string} value
 * @return {void}
 */
function isInteger(value) {
    return /^\d+$/.test(value);
}


/**
 *  router
 *
 * @return {void}
 */
function showPage() {
    const url = window.location.pathname;

    Requests.getUserProfile(null); // получим инфу по кукам
    createContent(); // структура
    createMenu();

    // конкретный контент
    switch (url) {
        // @todo  add regular expr
        case '': {
            createDesk();
            break;
        }
        case '/': {
            createDesk();
            break;
        }
        case '/main': {
            createDesk();
            break;
        }
        case '/registration': {
            if ( CurrentUser.Data.login !== 'null') {
                createDesk();
            } else {
                createDesk();
                createReg()
            }
            return
        }
        case '/autorization': {
            createDesk();
            if ( CurrentUser.Data.login === 'null') {
                createLogin(); // createAutorization()
            }
            return;
        }
        case '/profile': {
            createDesk();
            createProfile();
            break;
        }
        case '/profileSettings': {
            Requests.getUserProfile(createProfileSettings);
            break;
        }
        case '/chats': {
            //createDesk();
            goChats();
            break;
        }
        case '/notif': {
            //createDesk();
            goNotif();
            break;
        }
        // @todo add new pages

        default: {

           if (url.includes("/pin/")) { // если находится на странице пина
               const pinId = url.substring("/pin/".length, url.length);
               const isInt = isInteger(pinId);
               if (!isInt) {
                   console.log("error get pinID from url");
                   createDesk();
                   return;
               }
               // если url корректный, то запросим инфу о пине и отобразим его
               createPinPageFromRequest(pinId);
           }

           // не страница пина - по дефолту главная
            createDesk();
        }

    }
}

showPage();
