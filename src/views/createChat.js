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

export function createChatsView(state = null) {
    const userID = (state)? state.id : null;
    const backImage = serverLocate + backBtn;
    const chats = ChatsTemplate({backImage:backImage});
    const content = document.getElementById('content');
    content.innerHTML = chats;

    setBackImg();

    chatStorage.Data.idSelectedUser = -1;

    chatStorage.isAlreadyAddEvent = false
    getStickersForChat();
    getUsersForChat(userID);

}
