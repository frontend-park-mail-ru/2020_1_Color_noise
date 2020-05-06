import {serverLocateWebSocket, serverLocate} from  '../../utils/constants.js'
import FetchModule from '../Network/Network.js'
import {default as chatStorage } from "./currentChat.js"

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

    /*

     */

    var avatarFile = user.avatarPath
    if (avatarFile === undefined) {
        avatarFile = user.avatar
    }


    // установка шапки чата
    const chatChatSection = document.getElementById("chat_chat_section")
    const headerHtml = chatTemplate({avatarSrc: serverLocate + "/" + avatarFile,
        nameWith:user.login})
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
            sendMessage(inputMessage.value, user.id)
            inputMessage.value = ""
        }
    })

    // активируем отпарвку через enter
    inputMessage.addEventListener('keypress',  (e) =>{
        if (e.key === 'Enter') {
            if (inputMessage.value !== "") {
                sendMessage(inputMessage.value, user.id)
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

}


function showMessages(messageArr) {

    /* массив из:
    user_send - от кого (юзер)
    user_rec - кому (юзер)
    created_at
    message
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
        const messageHTML = chatMessageTemplate({dateTime:element.created_at, author: element.user_send.login,
            messageText:element.message, textClass:textClass, messageClass:messageClass})

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

    /*
       user_send - от кого (юзер)
       user_rec - кому (юзер) - не нужна инфа пока нет групп чата
       created_at
       message
       */

    console.log("Этот ли даилог:", chatStorage.Data.idSelectedUser , "  message sender", newMessageData.user_send.id)

    if (chatStorage.Data.idSelectedUser === newMessageData.user_send.id ||
        chatStorage.Data.idSelectedUser === newMessageData.user_rec.id ||
        CurrentUser.Data.id === newMessageData.user_send.id ||
        CurrentUser.Data.id === newMessageData.user_rec.id) {


        console.log("сообщение для текущего чата!!!")

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
            dateTime: newMessageData.created_at, author: newMessageData.user_send.login,
            messageText: newMessageData.message, textClass: textClass, messageClass: messageClass
        })

        let message = document.createElement('div');
        message.innerHTML = messageHTML
        chatHistory.appendChild(message)


        // скрол по истории вниз
        const chatHistoryClassForScroll = document.getElementsByClassName("chat_history")[0]
        chatHistoryClassForScroll.scrollTop = chatHistoryClassForScroll.scrollHeight;



    } else { // соообщение не для текущего чата
        console.log("сообщение НЕ ДЛЯ текущего чата!!!")
        let addArr = []
        addArr.push(newMessageData)
        chatStorage.addMessagesToStorage(addArr)


        var chatWithId = newMessageData.user_send.id
        if (chatWithId === CurrentUser.Data.id) {
            chatWithId = newMessageData.user_send.id
        }


        console.log("chatWithId", chatWithId)
        console.log("chatStorage.containsId(chatWithId):", chatStorage.containsId(chatWithId))

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

                    console.log("get NEW CONTACT USER:", jsonAns.body)
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

function sendMessage(message, userId) {
    console.log("SEND MESSAGE:", message, "\t to User with id:", userId)
    let jsonMsg = {
        user_id: userId,
        message: message,
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
