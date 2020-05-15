import ChatsTemplate from "../components/Chat/chats.pug";
import {unSetScroll} from "../components/Desk/Desk.js";
import '../components/Chat/chat.css'
import  {getUsersForChat, createWebSocket, addNewContact, getStickersForChat} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";


export function CreateChatView(user = null) {
    unSetScroll();
    document.title = "Chats";
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;

    chatStorage.Data.idSelectedUser = -1
    getUsersForChat();

    getStickersForChat();

    createWebSocket();

    // если пришли сюда от нажатия "написать" на странице профиля
    if (user !== null && user.login !== undefined) {
        // проверка user.login !== undefined из-за того что state
        // сюда проходит из роутера
        addNewContact(user)
    }
}