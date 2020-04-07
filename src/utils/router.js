import  { createRegistration } from '../views/createRegistration.js'
import { createLoginV } from "../views/createLogin.js"
import { Requests } from '../components/Network/Requests.js'
import {createProfileSettings} from "../components/ProfileSettings/ProfileSettings.js";
import { goNotif, goChats, createMenu } from '../components/Menu/Menu.js'
import {createContent} from "../components/Content/Content.js";
import {createDesk} from "../components/Desk/Desk";
import {createProfile} from "../components/Profile/Profile.js";

// for check url
function isInteger(value) {
    return /^\d+$/.test(value);
}




export class Router {

    constructor() {
        this.routs = {
            "/": createDesk,
            "/main": createDesk,
            "/registration": createRegistration,
            "/autorization": createLoginV, // authorization
            "/profile": createProfile,
            "/profileSettings": createProfileSettings,
            "/chats": goChats,
            "/notif":  goNotif,
        };

        window.addEventListener("popstate", event => {
            // Grab the history state id
            let path = event.state.path; //  event.state is null

            // Show clicked id in console (just for fun)
            console.log("path = ", path);

        });




    }


    go(path, title) {
        let state = {};
        state.path = path;
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
                    createDesk();
                    return;
                }
                // если url корректный, то запросим инфу о пине и отобразим его
                createPinPageFromRequest(pinId);
            }
            // не страница пина - по дефолту главная
            createDesk();


        } else {
            func();
        }
        console.log(func.toString())
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

}
