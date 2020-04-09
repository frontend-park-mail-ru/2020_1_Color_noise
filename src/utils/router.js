import  { createRegistration } from '../views/createRegistration.js'
import { createLoginView } from "../views/createLogin.js"
import { Requests } from '../components/Network/Requests.js'
import {createProfileSettings} from "../components/ProfileSettings/ProfileSettings.js";
import { goNotif, createMenu } from '../components/Menu/Menu.js'
import {createContent} from "../components/Content/Content.js";
import {CreateChatView} from "../views/createChat.js"
import {createProfileView} from "../views/createProfile.js";
import {createSubDeskView, createDeskView, createUserPinsDeskView, createBoardDeskView} from "../views/createDesk.js";
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

            // пути ниже буду проверяться в методе go(), если не будет совпадения с путями, обозначенными выше
            // проверяются в (func === undefined)
            //"/board/id": createBoardDeskView,
            // "/userPins": createUserPinsDeskView,
            // pin/pinID - будет проверяться, если ничего не подойдет
        };


        /*

        window.addEventListener("popstate", event => {

            event.preventDefault();
            let path = event.state.path;

            //alert("popstate EVENT: path:" + path.toString());
            //history.back();
            history.back();

            this.go(event.state.path, event.state.title);



        });
        */
        

        window.addEventListener('popstate', evt => {


            let path = evt.state.path;
            //alert("назад или вперед: path:" + path);

            this.go(path, evt.state.title, evt.state, false);


        });





    }


    go(path, title, state=null, needPush) {


        if (needPush === undefined || needPush === true) {
            //console.log("GO path:" + path)
            if (state == null)
                state = {};
            state.path = path;
            state.title = title;
            window.history.pushState(
                state,         // объект состояния
                title,  // заголовок состояния
                path  // URL новой записи (same origin)
            );
        }
        //alert("Go : path:" + path);

        createContent(); // структура
        createMenu();
        const func = this.routs[path];

        if (func === undefined) {

            // createPinPageFromRequest (pin/{pinID})
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
            } else


                //createUserPinsDeskView
            if (path.includes("/userPins/")) { // если находится на странице пинов одного пользователя
                const userId = path.substring("/userPins/".length, path.length);
                const isInt = isInteger(userId);
                if (!isInt) {
                    console.log("error get userID from url");
                    createDeskView();
                    return;
                }
                console.log("createUserPinsDeskView userid:",userId );
                // если url корректный, то отобразим пины пользователя
                const state = {};
                state.userId = userId;
                createUserPinsDeskView(state);

            } else


            //createBoardDeskView
            if (path.includes("/board/")) { // если находится на странице пинов одного пользователя
                const boardId = path.substring("/board/".length, path.length);
                const isInt = isInteger(boardId);
                if (!isInt) {
                    console.log("error get boardID from url");
                    createDeskView();
                    return;
                }
                console.log("createBoardDeskView boardid:",boardId );
                // если url корректный, то отобразим пины пользователя
                const state = {};
                state.deskId = boardId;
                createBoardDeskView(state);
                return;
            } else {

                // не страница пина - по дефолту главная
                alert("будет отображена главная по умолчанию");
                createDeskView();

            }








        } else {
            //console.log("ROUTE FUNC:",func)
            func(state);
        }

    }


    start() {
        // получает пользователя в синглтон currenUser и вызывает go(текущий путь)
        Requests.getUserProfile();
    }



    back() {

    }

    forward() {

    }

} export default  new Router();
