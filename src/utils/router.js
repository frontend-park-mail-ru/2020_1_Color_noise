import {Requests} from '../components/Network/Requests'
import {createMenu} from '../components/Menu/Menu'
import {createContent} from "../components/Content/Content";
import {createChatView} from "../views/createChat"
import {createUserView} from "../views/createUser";
import {createSettingsView} from "../views/createSettings";
import {
    createSubDeskView,
    createDeskView,
    createUserPinsDeskView,
    createBoardDeskView,
    createSmartDeskView
} from "../views/createDesk";
import {createNotificationsView} from "../views/createNotifications"
import {createNewPinView} from "../views/createNewPin";
import {createPinView} from "../views/createPin"
import {createLogoutView} from "../views/createLogout";
import {createOfflinePage} from "../components/OfflinePage/OfflinePage.js"
import {validators} from "./validation";
import {default as CurrentUser} from "../utils/userDataSingl";

class Router {
    constructor() {
        this.routs = {
            "/": createDeskView,
            "/smart":createSmartDeskView,
            "/subs": createSubDeskView,
            "/newpin": createNewPinView,
            "/settings": createSettingsView,
            "/chats": createChatView,
            "/notifications":  createNotificationsView,
            "/logout": createLogoutView
        };

        window.addEventListener('popstate', evt => {
            //Если зашли первый раз только на страницу и браузер сохранил уже ее себе в стек

            console.log("evt.state:",evt)
            /*
            if (evt.state === null) {
                this.go('/', null, evt.state, false);
            } else {

             */
                let path = window.location.pathname ;
                if (evt.state === null) {
                    let state = {}
                    state.path =  window.location.pathname;
                    state.title = document.title
                    state.path = window.location.pathname
                    this.go(path, state.title, state, false);
                    return
                }
                this.go(path, evt.state.title, evt.state, false);
           // }
        });
    }

    go(path, title, state=null, needPush=true) {
        if (!navigator.onLine) {
            createOfflinePage(path, title, state=null, needPush)
            return;
        }
        //console.log("path:", path, "   title:", title, " state:", state, "  needPush:", needPush)

        console.log("go:", path)
        console.log("window.location.pathname:", window.location.pathname)
        console.log("title:", title)
        document.title = title;

        // не надо сохранять состояние, если уже на нужной странице
        if (needPush === true && path !== window.location.pathname) {
            console.log("333 GO push:" + path);
            if (state == null)
                state = {};
            state.path = path;
            state.title = title;
            window.history.pushState(
                state,         // объект состояния
                state.title,  // заголовок состояния
                path  // URL новой записи (same origin)
            );
        }
        //alert("Go : path:" + path);

        const func = this.routs[path];
        if (func === undefined) {
            if (validators.pinLink(path)) {
                const pinId = path.substring("/pin/".length, path.length);
                const state = {};
                state.id = pinId;
                createPinView(state);
            } else if (validators.pinsUserLink(path)) {
                const userId = path.substring("/pins/user/".length, path.length);
                const state = {};
                state.id = userId;
                createUserPinsDeskView(state);
            } else if (validators.deskUserLink(path)) {
                console.log("нужная отрисовка доски")
                const boardId = path.substring("/desk/".length, path.length);
                const state = {};
                state.id = boardId;
                createBoardDeskView(state);
            } else if (validators.userLink(path)) {
                const userId = path.substring("/user/".length, path.length);
                const state = {};
                state.id = userId;
                createUserView(state);
            }  else if (validators.chatUserLink(path)) {
                const userId = path.substring("/chats/user/".length, path.length);
                const state = {};
                state.id = userId;
                //console.log("go start! 444", CurrentUser.Data)
                createChatView(state);
            }  else {
                // не страница пина - по дефолту главная
                createDeskView();
                document.title = 'Bug route!';
                alert('Bug route, сообщите отделу фротенда об этом!\n' + path); /* на защите убрать */
            }
        } else {
            console.log("ROUTE FUNC:",func);
            console.log("ROUTE state:",state);
            func(state);
        }
    }


    start() {
        if (!navigator.onLine) {
            createOfflinePage("createMenu");
            return;
        }
        createContent();

        /*
        let state = {}
        state.path = window.location.pathname
        window.history.pushState(
            state,         // объект состояния
            state.title = document.title,  // заголовок состояния
            window.location.pathname  // URL новой записи (same origin)
        );
         */

        Requests.getUserProfile(false).then((result) => {
            createMenu(result);
        });
    }
} export default new Router();