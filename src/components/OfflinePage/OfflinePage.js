import Router from "../../utils/router.js"
import offlinePageTemplate from "./offlinePage.pug"

import {createContent} from "../Content/Content.js";
import {Requests} from "../Network/Requests.js";
import {createMenu} from "../Menu/Menu.js";

export function createOfflinePage(path, title, state, needPush) {


    const root = document.getElementById("root")
    root.innerHTML = offlinePageTemplate()

    const offlinePageMsg = document.getElementById("offline_page_msg")

    const reloadBtn = document.getElementById("offline_page_reload_page_btn")
    reloadBtn.addEventListener("click", (evt)=>{

        if (navigator.onLine) {
            if (path === "createMenu") {
                createContent(); // структура
                Requests.getUserProfile(false).then((result) => {
                    createMenu(result);
                });
            } else {
                createContent(); // структура
                Requests.getUserProfile(false).then((result) => {
                    createMenu(result);
                });
                Router.go(path, title, state, needPush)
            }

        } else {
            offlinePageMsg.innerText = "Потеряно соединние с сервером, проверьте сеть и обновите страницу (соединение все еще не установлено)"
        }

        });

}