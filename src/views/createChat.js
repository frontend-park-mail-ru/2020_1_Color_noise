import ChatsTemplate from "../components/Chat/chats.pug";

import {
    getUsersForChat,
    createWebSocket,
    addNewContact,
    getStickersForChat,
    setBackImg,
    setSupportBtn,
    createDialog
} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";
import {serverLocate} from "../utils/constants";
import backBtn from "../images/backBtn.svg";
import {unSetScroll} from  "../components/Desk/Desk.js"
import FetchModule from "../components/Network/Network";
import {createMenu} from "../components/Menu/Menu";
import {default as Router} from "../utils/router";
import {setDataUser} from "../components/Network/Requests";



export function createChatView(userID = null) {
    unSetScroll();
    document.title = "Chats";

    chatStorage.isAlreadyAddEvent = false
    getStickersForChat();
    getUsersForChat(userID);

}
