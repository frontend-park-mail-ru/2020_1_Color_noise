import ChatsTemplate from "../components/Chat/chats.pug";
import {unSetScroll} from "../components/Desk/Desk.js";
import '../components/Chat/chat.css'
import  {getUsersForChat, createWebSocket, addNewContact} from "../components/Chat/chat"


export function CreateChatView(user = null) {
    unSetScroll();
    document.title = "Chats";
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;

    getUsersForChat();
    createWebSocket();


    // если пришли сюда от нажатия "написать" на странице профиля
    if (user !== null) {
        addNewContact(user)
    }

}