import  { createRegistration } from '../views/createRegistration.js'
import { createLoginView } from "../views/createLogin.js"
import { Requests } from '../components/Network/Requests.js'
import {createProfileSettings} from "../components/ProfileSettings/ProfileSettings.js";
import { goNotif, createMenu } from '../components/Menu/Menu.js'
import {createContent} from "../components/Content/Content.js";
import {CreateChatView} from "../views/createChat.js"
import {createProfileView} from "../views/createProfile.js";
import {createSubDeskView, createDeskView} from "../views/createDesk.js";
import {createNotificationsView} from "../views/createNotifications.js"
import {createPinPageFromRequest} from "../components/Pin/Pin.js"
import {authorizationOrRegistrationView} from "../views/createAuthorizationOrRegistration.js"

// for check url
function isInteger(value) {
    return /^\d+$/.test(value);
}


class Router {

    constructor() {
        this.routs = {
            "/": createDeskView,
            "/subscriptions": createSubDeskView,
            "/main": createDeskView,
            "/registration": createRegistration,
            "/authorization": createLoginView,
            "/profile": createProfileView,
            "/authorizationOrRegistration":authorizationOrRegistrationView,
            "/profileSettings": createProfileSettings,
            "/chats": CreateChatView,
            "/notifications":  createNotificationsView,
            // pin/pinID - будет проверяться, если ничего не подойдет
        };

        window.addEventListener("popstate", event => {
            // Grab the history state id
            let path = event.state.path; //  event.state is null
            this.go(event.state.path, event.state.title);
            // Show clicked id in console (just for fun)
            console.log("path = ", path);

        });


    }


    go(path, title, state=null) {
        if (state == null)
            state = {};

        state.path = path;
        state.title = title;
        window.history.pushState(
            state,         // объект состояния
            title,  // заголовок состояния
            path  // URL новой записи (same origin)
        );
        console.log("path:",path);
        createContent(); // структура
        createMenu();
        const func = this.routs[path];

        if (func === undefined) {

            if (path.includes("/pin/")) { // если находится на странице пина
                const pinId = path.substring("/pin/".length, path.length);
                const isInt = isInteger(pinId);
                if (!isInt) {
                    console.log("error get pinID from url");
                    createDeskView();
                    return;
                }
                // если url корректный, то запросим инфу о пине и отобразим его
                createPinPageFromRequest(pinId);
            }
            // не страница пина - по дефолту главная
            createDeskView();

        } else {
            console.log("ROUTE FUNC:",func)
            func(state);
        }

    }


    start() {
        Requests.getUserProfile(null);
        const url = window.location.pathname;
        this.go(url)
    }



    back() {

    }

    forward() {

    }

} export default  new Router();
