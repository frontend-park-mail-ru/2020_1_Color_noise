import {Requests} from '../components/Network/Requests'
import {createMenu} from '../components/Menu/Menu'
import {createContent} from "../components/Content/Content";
import {CreateChatView} from "../views/createChat"
import {createUserView} from "../views/createUser";
import {createSettingsView} from "../views/createSettings";
import {createSubDeskView, createDeskView, createUserPinsDeskView, createBoardDeskView} from "../views/createDesk";
import {createNotificationsView} from "../views/createNotifications"
import {createNewPinView} from "../views/createNewPin";
import {createPinPageFromRequest} from "../components/Pin/Pin"
import {createLogoutView} from "../views/createLogout";
import {createOfflinePage} from "../components/OfflinePage/OfflinePage.js"
import {validators} from "./validation";

class Router {
    constructor() {
        this.routs = {
            "/": createDeskView,
            "/subs": createSubDeskView,
            "/newpin": createNewPinView,
            "/settings": createSettingsView,
            "/chats": CreateChatView,
            "/notifications":  createNotificationsView,
            "/logout": createLogoutView
        };

        window.addEventListener('popstate', evt => {
            //Если зашли первый раз только на страницу и браузер сохранил уже ее себе в стек
           if (evt.state === null) {
                this.go('/', null, evt.state, false);
            } else {
                let path = evt.state.path;
                this.go(path, evt.state.title, evt.state, false);
            }
        });
    }

    go(path, title, state=null, needPush=true) {
        if (!navigator.onLine) {
            createOfflinePage(path, title, state=null, needPush)
            return;
        }

        if (needPush === true) {
            console.log("GO path:" + path);
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

        document.title = title;
        const func = this.routs[path];
        if (func === undefined) {
            if (validators.pinLink(path)) {
                const pinId = path.substring("/pin/".length, path.length);
                createPinPageFromRequest(pinId);
            } else if (validators.pinsUserLink(path)) {
                const userId = path.substring("/pins/user/".length, path.length);
                const state = {};
                state.userId = userId;
                createUserPinsDeskView(state);
            } else if (validators.deskUserLink(path)) {
                const boardId = path.substring("/desk/".length, path.length);
                const state = {};
                state.deskId = boardId;
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
                CreateChatView(userId);
            }  else {
                // не страница пина - по дефолту главная
                createDeskView();
                document.title = 'Bug route!';
                alert('Bug route, сообщите отделу фротенда об этом!\n' + path);
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
        Requests.getUserProfile(false).then((result) => {
            createMenu(result);
        });
    }
} export default  new Router();
