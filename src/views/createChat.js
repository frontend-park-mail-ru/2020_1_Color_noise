import ChatsTemplate from "../components/Chat/chats.pug";
import {default as CurrentUser} from "../utils/userDataSingl";
import {
    getUsersForChat,
    getStickersForChat, setBackImg,
} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";
import {unSetScroll} from "../components/Desk/Desk";
import {serverLocate} from "../utils/constants";
import backImage from "../images/backBtn.svg"
import closeContentImage from "../images/closeContent.svg"

export function createChatView(userID = null) {
    unSetScroll();
    document.title = "Chats";

   // console.log("chat view CurrentUser.data:", CurrentUser.data)

    if ( CurrentUser.Data === undefined || CurrentUser.Data.login === "null" || CurrentUser.Data.login === null ) {
        const backImage = serverLocate + backImage;
        const chats = ChatsTemplate({closeContentImage:backImage});
        const content = document.getElementById('content');
        content.innerHTML = chats;
        setBackImg();
        chatStorage.Data.idSelectedUser = -1
        const chatPeopleList = document.getElementById("chat_people-list")
        chatPeopleList.innerHTML = '<h3 class="chat_no_contact_msg"> Для использования чата необходимо авторизоваться.</h3>'
        return
    }

    chatStorage.isAlreadyAddEvent = false
    getStickersForChat();
    getUsersForChat(userID);

}
