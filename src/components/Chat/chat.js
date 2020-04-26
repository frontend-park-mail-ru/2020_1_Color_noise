import oneUserTemplate from "./oneUserInContactList.pug";
import chatTemplate from "./chatSection.pug";
import chatMessageTemplate from "./message.pug"
import chatNoSelectedTemplate from "./noSelectedUser.pug"
import {default as Router} from "../../utils/router";
import {default as CurrentUser} from '../../utils/userDataSingl.js';
import {default as WebSocketSingl} from './webSocket.js';
import {serverLocateWebSocket, serverLocate} from  '../../utils/constants.js'
import { FetchModule  } from '../Network/Network.js'
import {default as chatStorage } from "./currentChat.js"

export function getUsersForChat() {

    FetchModule.fetchRequest({url: serverLocate + "api/chat/users?start=0&limit=100", method:"get"})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: api/chat/users?start=0&limit=100");

            showContacts(jsonAns.body)

        })

        .catch((error) => {
            console.log('Что-то пошло не так с получением контактов в чате:', error);
        });

    createStartDialogScreen();
    // Получение сообщений: api/chat/user/id?start=value1&limit=value2 - get
    FetchModule.fetchRequest({url: serverLocate + "api/chat/user/id?start=0&limit=100", method: 'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: api/chat/user/id?start=0&limit=10");

            chatStorage.addMessagesToStorage(jsonAns.body)

        })

        .catch((error) => {
            console.log('Что-то пошло не так с получением сообщений:', error);
        });

}



function showContacts(UserContactsArr) {

    const fakeUsers = [{id:1, avatar:"https://cs5.pikabu.ru/post_img/2014/09/20/9/1411223409_443499651.jpg", login:"alex", onlineStatus:"online"},
        {id:2, avatar:"https://cs5.pikabu.ru/post_img/2014/09/20/9/1411223409_443499651.jpg", login:"Dima", onlineStatus:"online"},
        {id:3, avatar:"https://cs5.pikabu.ru/post_img/2014/09/20/9/1411223409_443499651.jpg", login:"Any", onlineStatus:"OFFline"},
        {id:4, avatar:"https://cs5.pikabu.ru/post_img/2014/09/20/9/1411223409_443499651.jpg", login:"Stas", onlineStatus:"online"} ]
    UserContactsArr = fakeUsers


    const chatUserList = document.getElementById("chat_user_list")
    UserContactsArr.forEach((element) => {

        if (!chatStorage.containsId(element.id)) {
            chatStorage.addUser(element);
        }

        const user = oneUserTemplate({ avatarScr:element.avatar,
            AuthorName:element.login, onlineStatus:""});

        let userBlock = document.createElement('div');
        userBlock.innerHTML = user

        userBlock.addEventListener('click', (evt) => {
            createDialog(element)
        })

        chatUserList.appendChild(userBlock)
    })


}

function createStartDialogScreen() {
    const chatChatSection = document.getElementById("chat_chat_section")
    const noSelected = chatNoSelectedTemplate()
    chatChatSection.innerHTML = noSelected
}






export function createDialog(user) {

    // фетч запрос на сообщения установка шапки чата
    const chatChatSection = document.getElementById("chat_chat_section")
    const headerHtml = chatTemplate({avatarSrc:user.avatar,
        nameWith:user.name, messagesCount:666})
    chatChatSection.innerHTML = headerHtml


    // при клике на изображения собеседника в шапке чата мы переходим в его профиль
    const headerImageLink =  document.getElementById("IdUserWithChat" + user.name)
    headerImageLink.addEventListener("click", (evt) => {
        const User = [];
        User.avatarPath = user.avatar; // тут проверить какие поля будут у юзера после того как все заработает !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        User.login = user.name;
        User.id = user.id;

        Router.go("/profile", "Profile", User)
    })


    // активируем кнопку отправки
    const sendMessageBtn = document.getElementById("chat_send_message_btn")
    sendMessageBtn.addEventListener("click", (evt)=>{
        const inputMessage =  document.getElementById("message_to_send").value
        if (inputMessage !== "") {
            sendMessage(inputMessage, user.id)
        }
    })


    // показываем сообщения из хранилища
    const messages = chatStorage.getMessagesFromStorage(user.id)
    showMessages(messages)

}


function showMessages(messageArr) {

    /* массив из:
    user_send - от кого (юзер)
    user_rec - кому (юзер)
    created_at
    message
    */

    const chatHistory = document.getElementById("chat_history")

    messageArr.forEach( (element)=> {

        if (!chatStorage.containsId(element.user_send.id) && element.user_send.id !== CurrentUser.Data.id) {
            chatStorage.addUser(element.user_send);
            addNewContact(element.user_send);
        }



        // данные классы определяютк как будет выглядеть сообщение в чате
        // это чтобы различать свои сообщения от сообщений собеседника
        let textClass = "chat_message chat_float-right  chat_my_message";
        let messageClass = "message_data chat_align-right"
        if (element.user_send.id !== CurrentUser.Data.id) {
            textClass = "chat_message chat_align-left  chat_other_message";
            messageClass = "message_data chat_align-left"
        }
        const messageHTML = chatMessageTemplate({dateTime:element.created_at, author: element.user_send.login,
            messageText:element.message, textClass:textClass, messageClass:messageClass})

        let message = document.createElement('div');
        message.innerHTML = messageHTML
        chatHistory.appendChild(message)
    })

}



export function addNewContact(newUser) {
    console.log("сообщения от пользователя что не в контактах или новый:", newUser.login)

    if (!chatStorage.containsId(newUser.id)) { // даная проверка нужна есди мы добавляем юзера в контакты при нажатии "написать"
        chatStorage.addUser(newUser);
    }

    const chatUserList = document.getElementById("chat_user_list")
    const user = oneUserTemplate({ avatarScr:newUser.avatar,
        AuthorName:newUser.login, onlineStatus:""});

    let userBlock = document.createElement('div');
    userBlock.innerHTML = user

    userBlock.addEventListener('click', (evt) => {
        createDialog(newUser)
        chatStorage.Data.idSelectedUser = newUser.id
    })

    chatUserList.appendChild(userBlock)

}

export function createWebSocket() {

    WebSocketSingl.webSocketSingl =  new WebSocket(serverLocateWebSocket + "/api/chat");
    WebSocketSingl.webSocketSingl.onopen =  () => {
        console.log("Status: Connected\n");
    };

    WebSocketSingl.webSocketSingl.onmessage =  (e) => {
        console.log("Server: " + e.data + "\n");
        let data = JSON.parse(e.data)
        if (data.status === 200) {
            addNewMessage(data.body)
        } else {
            console.log("Ошибка приема сообщения по webSocket")
        }
    };

}


function addNewMessage(newMessageData) {

    /*
       user_send - от кого (юзер)
       user_rec - кому (юзер) - не нужна инфа пока нет групп чата
       created_at
       message
       */

    if (chatStorage.Data.idSelectedUser === newMessageData.user_send.id ||
        chatStorage.Data.idSelectedUser === newMessageData.user_rec.id ||
        CurrentUser.Data.id === newMessageData.user_send.id ||
        CurrentUser.Data.id === newMessageData.user_rec.id) {


        let addArr = []
        addArr.push(newMessageData)
        chatStorage.addMessagesToStorage(addArr)


        const chatHistory = document.getElementById("chat_history")

        let textClass = "chat_message chat_float-right  chat_my_message";
        let messageClass = "message_data chat_align-right"
        if (newMessageData.user_send.id !== CurrentUser.Data.id) {
            textClass = "chat_message chat_align-left  chat_other_message";
            messageClass = "message_data chat_align-left"
        }

        const messageHTML = chatMessageTemplate({
            dateTime: newMessageData.created_at, author: user_send.login,
            messageText: newMessageData.message, textClass: textClass, messageClass: messageClass
        })

        let message = document.createElement('div');
        message.innerHTML = messageHTML
        chatHistory.appendChild(message)

    } else { // соообщение не для текущего чата

        let addArr = []
        addArr.push(newMessageData)
        chatStorage.addMessagesToStorage(addArr)

    }



}

function sendMessage(message, userId) {
    console.log("SEND MESSAGE:", message, "\t to User with id:", userId)
    let jsonMsg = {
        user_id: userId,
        message: message,
    };
    let json = JSON.stringify(jsonMsg);
    WebSocketSingl.webSocketSingl.send(json);
}


