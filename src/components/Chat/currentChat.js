import {default as CurrentUser} from '../../utils/userDataSingl.js';

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
    }

    containsId(id) {
        this.Data.userContactsList.forEach( (element) => {
            if (element.id === id)
                return true
        })
        return false
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
  */
        messageArr.forEach((element)=>{

            if (CurrentUser.Data.id === element.user_rec.id) { // если получатель текущей пользователь

                if (this.MessageData[element.user_send.id] === undefined) {
                    this.MessageData[element.user_send.id] = []
                    this.MessageData[element.user_send.id].push(element)
                } else {
                    this.MessageData[element.user_send.id].push(element)
                }

            } else { // если текущий пользователь отправитель

                if (this.MessageData[element.user_rec.id] === undefined) {
                    this.MessageData[element.user_rec.id] = []
                    this.MessageData[element.user_rec.id].push(element)
                } else {
                    this.MessageData[element.user_rec.id].push(element)
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

    return result
    }



}

export default new chatStorage();

