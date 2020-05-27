import ChatsTemplate from "../components/Chat/chats.pug";
import {default as CurrentUser} from "../utils/userDataSingl";
import {
    getUsersForChat, createContactPageAfterGetUsers,
    getStickersForChat, setBackImg, addNewContact, createDialog,
} from "../components/Chat/chat"
import {default as chatStorage} from "../components/Chat/currentChat.js";
import {unSetScroll} from "../components/Desk/Desk";
import {serverLocate} from "../utils/constants";
import backImage from "../images/backBtn.svg"
import closeContentImage from "../images/closeContent.svg"
import FetchModule from "../components/Network/Network";

export function createChatView(userID = null) {
    unSetScroll();
    document.title = "Chats";



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


    //
    if ( userID !== null && userID.id !== null && Number.isInteger(Number(userID.id)) ) {
        // если пришли сюда от нажатия "написать" на странице профиля (прокидываем это через view create Chat)
        //console.log("itIsNumber(userID):", itIsNumber(userID.id) , "\t userID:", userID)

            //console.log("ДОБАВЛЯЕТСЯ КОНТАКТ userID:", userID.id)
            // проверка user.login !== undefined из-за того что state
            // сюда проходит из роутера
            addNewContact(userID.id);



            FetchModule.fetchRequest({url: serverLocate + "/api/user/" + userID.id, method:"get", body:null})
                .then((res) => res.ok ? res : Promise.reject(res))
                .then( (response) =>
                    response.json(),
                )
                .then((result) => {
                    chatStorage.addUser(result.body)
                    createContactPageAfterGetUsers();
                    createDialog(result.body)
                })
                .catch((error) => {
                    console.log("getUserProfile for create Dialog ERROR:", error);
                });

        chatStorage.isAlreadyAddEvent = false
        getStickersForChat();

        return;
    }


    chatStorage.isAlreadyAddEvent = false
    getStickersForChat();
    getUsersForChat(userID);

}
