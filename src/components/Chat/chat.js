import {serverLocateWebSocket, serverLocate} from  '../../utils/constants.js'
import FetchModule from '../Network/Network.js'
import {default as chatStorage } from "./currentChat.js"
import {default as WebSocketSingl} from "./webSocket.js"
import oneUserTemplate from "./oneUserInContactList.pug"
import chatTemplate from "./chatSection.pug"
import chatNoSelectedTemplate from "./noSelectedUser.pug";
import { default as CurrentUser } from '../../utils/userDataSingl.js';
import chatMessageTemplate from "./message.pug"




export function getUsersForChat() {

    chatStorage.Data.idSelectedUser = -1
    chatStorage.Data.userContactsList = []



    FetchModule.fetchRequest({url: serverLocate + "/api/chat/users?start=0&limit=100", method:"get"})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: api/chat/users?start=0&limit=100");

            if (jsonAns.body.length !== 0) {
                showContacts(jsonAns.body)
            }


        })

        .catch((error) => {
            console.log('Что-то пошло не так с получением контактов в чате:', error);
        });


    createStartDialogScreen();



}



function showContacts(UserContactsArr) {


    const chatUserList = document.getElementById("chat_user_list")
    UserContactsArr.forEach( function(element)  {

        if (element.id === CurrentUser.Data.id) {
            return;
        }


        console.log("ADD USER FROM ARR: element:", element)
        if (!chatStorage.containsId(element.id)) {
            chatStorage.addUser(element);
        } else {
            console.log("он уже есть!")
            return;
        }

        console.log("showContacts: element avatar:", serverLocate +"/"+ element.avatar)



        const user = oneUserTemplate({ avatarScr: serverLocate +"/"+ element.avatar,
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
    chatChatSection.innerHTML = chatNoSelectedTemplate()

    setReturnBtn();

}






export function createDialog(user) {

    chatStorage.Data.idSelectedUser = user.id

    console.log("createDialog:: user:", user)



    var avatarFile = user.avatarPath
    if (avatarFile === undefined) {
        avatarFile = user.avatar
    }


    // установка шапки чата
    const chatChatSection = document.getElementById("chat_chat_section")
    const headerHtml = chatTemplate({avatarSrc: serverLocate + "/" + avatarFile,
        nameWith:user.login, emojiImgSrc: serverLocate + "/images/chat_emoji.png"})
    chatChatSection.innerHTML = headerHtml


    // при клике на изображения собеседника в шапке чата мы переходим в его профиль
    const headerImageLink =  document.getElementById("IdUserWithChat" + user.login)
    headerImageLink.addEventListener("click", (evt) => {
        const User = [];
        User.avatarPath = user.avatar; // тут проверить какие поля будут у юзера после того как все заработает !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        User.login = user.login;
        User.id = user.id;

        Router.go("/profile", "Profile", User)
    })



    const inputMessage =  document.getElementById("message_to_send")
    // активируем кнопку отправки
    const sendMessageBtn = document.getElementById("chat_send_message_btn")
    sendMessageBtn.addEventListener("click", (evt)=>{
        if (inputMessage.value !== "") {
            sendMessage(inputMessage.value,"", user.id)
            inputMessage.value = ""
        }
    })

    // активируем отпарвку через enter
    inputMessage.addEventListener('keypress',  (e) =>{
        if (e.key === 'Enter') {
            if (inputMessage.value !== "") {
                sendMessage(inputMessage.value, "", user.id)
                inputMessage.value = ""
            }
        }
    });




    // Получение сообщений: api/chat/user/id?start=value1&limit=value2 - get
    //  api/chat/user/id?start=value1&limit=value2 - get
    FetchModule.fetchRequest({url: serverLocate + "/api/chat/messages/" + user.id + "?start=0&limit=100", method: 'get'})
        .then((response) => {
            return response.ok ? response : Promise.reject(response);
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonAns) => {

            if (jsonAns.status !== 200)
                throw Error("not 200: api/chat/user/id?start=0&limit=10");

            if (jsonAns.body.length !== 0) {
                console.log("MESSAGES:", jsonAns.body)
                chatStorage.addMessagesToStorage(jsonAns.body)

                // показываем сообщения из хранилища
                const messages = chatStorage.getMessagesFromStorage(user.id)
                if (messages !== undefined ) {

                    showMessages(messages)
                } else {
                    console.log("createDialog: нет сообщений с этим пользователем:", user.login)
                }
            }

        })

        .catch((error) => {
            console.log('Что-то пошло не так с получением сообщений:', error);
        });




    setReturnBtn();
    setEventShowStickers();
    setEventShowEmogi();

}


function showMessages(messageArr) {

    /* массив из:
    user_send - от кого (юзер)
    user_rec - кому (юзер)
    created_at
    message
    sticker
    */

    const chatHistory = document.getElementById("chat_history")

    console.log("showMessages ARR:", messageArr);



    messageArr.forEach( (element)=> {


        //console.log("chatStorage.containsId(element.user_send.id):", chatStorage.containsId(element.user_send.id))

        if (!chatStorage.containsId(element.user_send.id) && element.user_send.id !== CurrentUser.Data.id) {
            console.log("ADD NEW CONTACT:", element.user_send.login)
            chatStorage.addUser(element.user_send);
            addNewContact(element.user_send);
            return // не надо добавлять так как сейчас открыт другой чат
        }


        if (element.user_send.id === element.user_rec.id ) {
            return; // последнее почему-то дублируется ИЗ-ЗА этого условия невозможен чат с самим собой!
        }

      //  console.log("add message:", element);


        // данные классы определяютк как будет выглядеть сообщение в чате
        // это чтобы различать свои сообщения от сообщений собеседника
        let textClass = "chat_message chat_float-right  chat_my_message";
        let messageClass = "message_data chat_align-right"
        if (element.user_send.id !== CurrentUser.Data.id) {
            textClass = "chat_message chat_align-left  chat_other_message";
            messageClass = "message_data chat_align-left"
        }

        let stickerCSSClass = " "
        if (element.sticker === serverLocate + "/undefined"){
            stickerCSSClass = " chat_sticker_hidden"
        }


        const messageHTML = chatMessageTemplate({dateTime:element.created_at, author: element.user_send.login, stickerSrc:element.sticker,
            messageText:element.message, textClass:textClass, messageClass:messageClass, stickerCSSClass:stickerCSSClass})



        let message = document.createElement('div');
        message.innerHTML = messageHTML
        chatHistory.appendChild(message)
    })


    // скрол по истории вниз
    const chatHistoryClassForScroll = document.getElementsByClassName("chat_history")[0]
    chatHistoryClassForScroll.scrollTop = chatHistoryClassForScroll.scrollHeight;

}



export function addNewContact(newUser) {
    console.log("сообщения от пользователя что не в контактах или новый:", newUser.login)

    if (!chatStorage.containsId(newUser.id)) { // даная проверка нужна есди мы добавляем юзера в контакты при нажатии "написать"
        chatStorage.addUser(newUser);
    }

    const chatUserList = document.getElementById("chat_user_list")
    const user = oneUserTemplate({ avatarScr: serverLocate +"/"+ newUser.avatarPath,
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

    if (WebSocketSingl.isConnected) {
        console.log("Не надо второй раз соединяться с сокетом")
        return
    }


    console.log("try to connect webSocket")
    WebSocketSingl.webSocketSingl = new WebSocket(serverLocateWebSocket + "/api/chat/ws");
    WebSocketSingl.isConnected = true



    WebSocketSingl.webSocketSingl.onopen =  () => {
        //WebSocketSingl.webSocketSingl.send(document.cookie);
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


    newMessageData.created_at = newMessageData.created_at.substr(0, newMessageData.created_at.length - 8).replace("T","  ")

    /*
       user_send - от кого (юзер)
       user_rec - кому (юзер) - не нужна инфа пока нет групп чата
       created_at
       message
       sticker
       */



    console.log("Этот ли даилог:", chatStorage.Data.idSelectedUser , " = message sender", newMessageData.user_send.id)

    if (chatStorage.Data.idSelectedUser === newMessageData.user_send.id ||
        chatStorage.Data.idSelectedUser === newMessageData.user_rec.id ||
        CurrentUser.Data.id === newMessageData.user_send.id ||
        CurrentUser.Data.id === newMessageData.user_rec.id) {



        // todo обработка стикера
        let stickerCSSClass = " "
        if (newMessageData.sticker === undefined){
            stickerCSSClass = " chat_sticker_hidden"
        }

        //console.log("сообщение для текущего чата!!!")

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
            dateTime: newMessageData.created_at, author: newMessageData.user_send.login, stickerSrc:newMessageData.sticker,
            messageText: newMessageData.message, textClass: textClass, messageClass: messageClass, stickerCSSClass:stickerCSSClass
        })

        let message = document.createElement('div');
        message.innerHTML = messageHTML
        chatHistory.appendChild(message)


        // скрол по истории вниз
        const chatHistoryClassForScroll = document.getElementsByClassName("chat_history")[0]
        chatHistoryClassForScroll.scrollTop = chatHistoryClassForScroll.scrollHeight;



    } else { // соообщение не для текущего чата
        //console.log("сообщение НЕ ДЛЯ текущего чата!!!")
        let addArr = []
        addArr.push(newMessageData)
        chatStorage.addMessagesToStorage(addArr)


        var chatWithId = newMessageData.user_send.id
        if (chatWithId === CurrentUser.Data.id) {
            chatWithId = newMessageData.user_send.id
        }


        //console.log("chatWithId", chatWithId)
       // console.log("chatStorage.containsId(chatWithId):", chatStorage.containsId(chatWithId))

        if (!chatStorage.containsId(chatWithId)) { // если его нет в контактах

            // api/user/{id} - get
            FetchModule.fetchRequest({url: serverLocate + "/api/user/" + chatWithId.toString(), method:"get"})
                .then((response) => {
                    return response.ok ? response : Promise.reject(response);
                })
                .then((response) => {
                    return response.json();
                })
                .then((jsonAns) => {

                    if (jsonAns.status !== 200)
                        throw Error("not 200: api/user/{id} - get");

                   // console.log("get NEW CONTACT USER:", jsonAns.body)
                    jsonAns.body.avatarPath = jsonAns.body.avatar // когда-то я убью себя за такое

                    chatStorage.addUser(jsonAns.body);
                    addNewContact(jsonAns.body)

                })

                .catch((error) => {
                    console.log('Что-то пошло не так с инфы для новового контакта (новый контакт из-за нового сообщения):', error);
                });

        }

    }

}

function sendMessage(message, sticker, userId) {
    console.log("SEND MESSAGE:", message, "\t to User with id:", userId)
    let jsonMsg = {
        user_id: userId,
        message: message,
        sticker: sticker,
    };
    let json = JSON.stringify(jsonMsg);
    WebSocketSingl.webSocketSingl.send(json);

}

function setReturnBtn() {

    const returnBtnId = document.getElementById("chat_return_btn_id")

    returnBtnId.addEventListener("click", (evt)=>{
        window.history.back();
    })
    /*
    если пользователь накликал много раз на иконку чата и потом нажал "назад"
    то он будет кликать назад столько же раз назад! крч надо чуть подфиксить роутер
     */

}



export function getStickersForChat() {
    // Получение стикеров: api/chat/stickers - get
    FetchModule.fetchRequest({ url: serverLocate + '/api/chat/stickers', method:'get',})
        .then((res) => {
            return res.ok ? res : Promise.reject(res);
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log("stickers:", result);
            if (result.body.length === 0) {
                console.log("no stickers in response")
                return;
            }
            console.log("stickers:",result.body)
            chatStorage.addStickers(result.body);

        })
        .catch(function(error) {
            console.log("ERR get stickers:", error);
        });
}


function setEventShowStickers() {

    /*
    // todo тут фальшивые стикеры пока бэк их не отдает!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const FAKE_STICKERS = [{src:"https://nakleikashop.ru/images/detailed/22/CAT-110.png", id:1},
        {src:"https://app.clilk.com/db/userpics/577ded585c498eeb6f3926d6.png", id:2},
        {src:"https://avatanplus.com/files/resources/original/57b744017249d156a3e1a5bc.png", id:3},
        {src:"https://telegram.org.ru/uploads/posts/2017-03/1490197642_13.png", id:4},
        {src:"https://vkclub.su/_data/stickers/persik/sticker_vk_persik_023.png", id:5},
        {src:"https://nakleikashop.ru/images/detailed/22/CAT-109.png", id:6},
    ]
    chatStorage.addStickers(FAKE_STICKERS);
    */

    const chatSendSticker = document.getElementById("chat_send_sticker")
    chatSendSticker.addEventListener("click", (evt)=> {


        const darkLayer = document.createElement('div');
        darkLayer.id = 'shadow';
        document.body.appendChild(darkLayer);

        const showBlock = document.getElementById('sticker_select');
        showBlock.style.display = 'block';

        darkLayer.onclick = () => {
            darkLayer.parentNode.removeChild(darkLayer);
            showBlock.style.display = 'none';
            return false;
        };


        // add stickers images
        if (!chatStorage.isAlreadyAddStickersInStickersSelect) {

            console.log("chatStorage.stickersArr:", chatStorage.stickersMap)

            chatStorage.stickersMap.forEach((sticker) => {
                const stickerHtml = document.createElement("img")
                stickerHtml.className = "one_sticker"
                stickerHtml.setAttribute("src", sticker)

                stickerHtml.addEventListener("click", evt => {

                    // send
                    sendMessage("", sticker, chatStorage.Data.idSelectedUser );
                    console.log("send sticker:", sticker)
                    darkLayer.parentNode.removeChild(darkLayer);
                    showBlock.style.display = 'none';

                })

                console.log("try add img:", stickerHtml)

                showBlock.appendChild(stickerHtml)


            });

            chatStorage.isAlreadyAddStickersInStickersSelect = true
        }

        // кнопочка НАЗАД в стикерах
        const stickerSelectBackBtn = document.getElementById("sticker_select_back_btn")
        stickerSelectBackBtn.addEventListener("click", (evt)=>{
            darkLayer.parentNode.removeChild(darkLayer);
            showBlock.style.display = 'none';

        })

    })


}


function setEventShowEmogi(){

    const chatEmojiImg = document.getElementById("chat_emoji_img")

    let isShowingEmojiSelect = false


    chatEmojiImg.addEventListener("mouseover", evt=>{

        if (isShowingEmojiSelect === true) {
            return
        }
        isShowingEmojiSelect = true;



        //const darkLayer = document.createElement('div');
        //darkLayer.id = 'shadow';
        //document.body.appendChild(darkLayer);

        const showBlock = document.getElementById('emoji_selector_menu');
        showBlock.style.display = 'block';

        // moseout
        showBlock.addEventListener("click", evt=>{
            showBlock.style.display = 'none';
            isShowingEmojiSelect = false

        })

        /*
        darkLayer.mousemove = () => {
            console.log("REMOVE!!")
            darkLayer.parentNode.removeChild(darkLayer);
            showBlock.style.display = 'none';
            isShowingEmojiSelect = false

            return false;
        };


         */



        console.log("on focus")

    })



}
