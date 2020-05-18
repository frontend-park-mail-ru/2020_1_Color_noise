import {default as CurrentUser} from '../../utils/userDataSingl.js';
import {serverLocate} from "../../utils/constants";

/**
 *  chat storage  singleton
 */
class chatStorage {
    constructor(){
        this.Data = { // контакты
            idSelectedUser: -1,
            userContactsList: []
        };
        this.MessageData = {}; // сообщения
        this.stickersMap = new Map();
        this.isAlreadyAddStickersInStickersSelect = false;
    }

    containsId(id) {
        let isContnains = false
        this.Data.userContactsList.forEach( (element) => {
            if (element.id === id) {
                isContnains = true
            }

        })
        return isContnains
    }

    addUser(user) {
        this.Data.userContactsList.push(user)
    }


    addMessagesToStorage(messageArr){
        /* массив из:
  user_send - от кого (юзер)
  user_rec - кому (юзер)
  created_at
  message
  sticker
  */
        messageArr.forEach((element)=>{

            element.created_at = element.created_at.substr(0, element.created_at.length - 8).replace("T","  ")

            // todo обработка стикера
            if (element.sticker !== "") {
                element.sticker = serverLocate + "/" + element.sticker
            }


            if (CurrentUser.Data.id === element.user_rec.id) { // если получатель текущей пользователь

                if (this.MessageData[element.user_send.id] === undefined) {
                    this.MessageData[element.user_send.id] = []
                    this.MessageData[element.user_send.id].push(element)
                } else {

                    var needAdd = true
                    this.MessageData[element.user_send.id].forEach((checkUniq)=>{

                        if (checkUniq.created_at === element.created_at) {
                            needAdd = false
                        }}
                    )
                    if (needAdd){
                        this.MessageData[element.user_send.id].push(element)
                    }



                }

            } else { // если текущий пользователь отправитель

                if (this.MessageData[element.user_rec.id] === undefined) {
                    this.MessageData[element.user_rec.id] = []
                    this.MessageData[element.user_rec.id].push(element)
                } else {


                    var needAdd = true
                    this.MessageData[element.user_rec.id].forEach((checkUniq)=>{

                        if (checkUniq.created_at === element.created_at) {
                            needAdd = false
                        }}
                    )
                    if (needAdd){
                        this.MessageData[element.user_rec.id].push(element)
                    }


                }
            }
        })

    }



    getMessagesFromStorage(SenderId){

        if (this.MessageData[SenderId] === undefined) {
            console.log("getMessagesFromStorage: еще нет сообщений с этим пользователем")
            return
        }

        let result = []
        this.MessageData[SenderId].forEach((element)=> {
            result.push(element)
        })

        console.log("result messages:", result)
        this.MessageData = {} // todo сделать без запроса всех при переключении чата
    return result
    }


    addStickers(stickerArr) {
        stickerArr.forEach( (stickerNew) => {
            console.log("sticker add:", serverLocate + "/" + stickerNew)
            this.stickersMap.set(stickerNew, serverLocate + "/" + stickerNew);
            console.log("STICKER ADEED:", this.stickersMap[stickerNew])

        });
    }




}

export default new chatStorage();

