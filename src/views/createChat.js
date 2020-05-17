import ChatsTemplate from "../components/Chat/chats.pug";
import {unSetScroll} from "../components/Desk/Desk.js";
import '../components/Chat/chat.css'
import  {getUsersForChat, createWebSocket, addNewContact, getStickersForChat, setBackImg} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";
import {serverLocate} from "../utils/constants";
import backBtn from "../images/backBtn.svg";

export function CreateChatView(userID = null) {
    unSetScroll();
    document.title = "Chats";
    const backImage = serverLocate + backBtn;
    const chats = ChatsTemplate({backImage:backImage});
    const content = document.getElementById('content');
    content.innerHTML = chats;


    setBackImg();

    chatStorage.Data.idSelectedUser = -1

    getUsersForChat();

    getStickersForChat();

    createWebSocket();

    // если пришли сюда от нажатия "написать" на странице профиля
    if (userID !== null) {
        // проверка user.login !== undefined из-за того что state
        // сюда проходит из роутера
        addNewContact(userID);
    }
}