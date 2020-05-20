import ChatsTemplate from "../components/Chat/chats.pug";

import  {getUsersForChat, createWebSocket, addNewContact, getStickersForChat, setBackImg, setSupportBtn} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";
import {serverLocate} from "../utils/constants";
import backBtn from "../images/backBtn.svg";
import {unSetScroll} from  "../components/Desk/Desk.js"



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

    setSupportBtn();

    // если пришли сюда от нажатия "написать" на странице профиля
    console.log("itIsNumber(userID):", itIsNumber(userID) , "\t userID:", userID)
    if (Number.isInteger(Number(userID))) {
        console.log("ДОБАВЛЯЕТСЯ КОНТАКТ userID:", userID)
        // проверка user.login !== undefined из-за того что state
        // сюда проходит из роутера
        addNewContact(userID);
    }

}

function itIsNumber(value) {
    if(value instanceof Number)
        value = value.valueOf();
    return  isFinite(value) && value === parseInt(value, 10);
}