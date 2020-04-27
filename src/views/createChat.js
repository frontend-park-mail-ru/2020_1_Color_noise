import ChatsTemplate from "../components/Profile/chats.pug";
import {unSetScroll} from "../components/Desk/Desk.js";


export function createChatView() {
    unSetScroll();
    document.title = "Chats";
    const chats = ChatsTemplate();
    const content = document.getElementById('content');
    content.innerHTML = chats;
}